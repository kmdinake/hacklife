app.controller('UserController', [
    '$scope', '$rootScope', '$location', 'UserService', 'DataService', 'Upload',
    function UserController($scope, $rootScope, $location, UserService, DataService, Upload){
    /* User Attributes */
    $scope.userEmail = "";
    $scope.userFullname = "";
    $scope.datasets = [];
    $scope.activeDataset = null;
    $scope.showTrendProfileHistory = false;
    $scope.showingSampleData = false;
    $scope.url = 'uploads';
    $scope.fileToUp = "";

    /* Helper Methods */

    $scope.showTrendHistory = function(val){
        $scope.showTrendProfileHistory = val;
    };

    $scope.showSampleData = function(val){
        if (val == true){
            DataService.getDataSamples($scope.activeDataset.datasetID).then(
                function success(res){
                    if (res.status == 200 && res.data != undefined && res.data != null && JSON.parse(res.data).result != "failed"){
                        $scope.activeDataset.dataSamples = JSON.parse(res.data).result;
                    } else {
                        var msg = "Ooops! Well this is embarrassing. ";
                        msg += "Something went wrong trying to retrieve data samples for ";
                        msg += $scope.activeDataset.datasetName;
                        msg += ". Please try again later.";
                        var code = 400;
                        console.log(res.data + " <> " + code + " <> " + msg);
                        //$location.url('/error?errCode=' + code + '&errText=' + msg);
                        return;
                    }
                },
                function failure(res){
                    console.log(res.data);
                    var msg = "Ooops! Well this is embarrassing. ";
                    msg += "Something went wrong trying to retrieve data samples for ";
                    msg += $scope.activeDataset.datasetName;
                    msg += ". Please try again later.";
                    var code = res.status;
                    //$location.url('/error?errCode=' + code + '&errText=' + msg);
                    return;
                }
            );
        }
        $scope.showingSampleData = val;
    };

    $scope.setActiveDataset = function(dataset){
        $scope.activeDataset = dataset;
        if($scope.showTrendProfileHistory === true){
            $scope.showTrendHistory(false);
        }
        if($scope.showSampleData === true){
            $scope.showSampleData(false);
        }
    };

    $scope.goRouteTo = function(route){
        $location.path(route);
    };

    $scope.getDatasets = function(){
        DataService.getUserDatasets($scope.userEmail).then(
            function success(res) {
                if (res.status == 200 && res.data !== undefined && res.data !== null){
                    if (res.data.result != "failed" && res.data.result.my_data !== undefined){
                        $scope.datasets = res.data.result.my_data;
                    } else {
                        $scope.datasets = [];
                    }
                } else {
                    console.log(res.data);
                    var msg = "Ooops! Well this is embarrassing. ";
                    msg += "Something went wrong trying to retrieve your datasets. ";
                    msg += "Please try again later.";
                    var code = res.status;
                    $location.path('/error?errCode=' + code + '&errText=' + msg);
                    return;
                }
            },
            function failure(res) {
                console.log(res.data);
                var msg = "Ooops! Well this is embarrassing. ";
                msg += "Something went wrong trying to retrieve your datasets. ";
                msg += "Please try again later.";
                var code = res.status;
                $location.url('/error?errCode=' + code + '&errText=' + msg);
                return;
            }
        );
    };

    $scope.changeAccessMod = function(datasetID, access_mod){
        if (datasetID == "" || datasetID == null || access_mod == null) return;
        if (access_mod == "private") access_mod = "public";
        else if (access_mod == "public") access_mod = "private";
        else return;
        DataService.changeDatasetAccessMod(datasetID, access_mod).then(
            function success(res){
                if (res.status == 200 && res.data != undefined && res.data != null && JSON.parse(res.data).result != "failed"){
                    // alert the user that the change succeeded
                    $scope.getDatasets();
                } else {
                    console.log(res.data);
                    var msg = "Ooops! Well this is embarrassing. ";
                    msg += "Something went wrong trying to share your dataset. ";
                    msg += "Please try again later.";
                    var code = 400;
                    $location.url('/error?errCode=' + code + '&errText=' + msg);
                    return;
                }
            },
            function failure(res){
                console.log(res.data);
                var msg = "Ooops! Well this is embarrassing. ";
                msg += "Something went wrong trying to share your dataset. ";
                msg += "Please try again later.";
                var code = res.status;
                $location.url('/error?errCode=' + code + '&errText=' + msg);
                return false;
            }
        );
    };

    $scope.downloadDataset = function(datasetName, datasetID){
        if (datasetName == "" || datasetName == null || datasetID == "" || datasetID == null) return;
        DataService.downloadDataset(datasetID, $scope.userEmail).then(
            function success(res){
                if (res.status == 200 && res.data != undefined && res.data != null && res.data.result != "failed"){
                    //$scope.download_path = res.data.result;
                    $scope.getDatasets();
                } else {
                    var msg = "Ooops! Well this is embarrassing. ";
                    msg += "Something went wrong trying to download " + datasetName;
                    msg += ". Please try again later.";
                    var code = 400;
                    console.log(res.data + " <> " + code + " <> " + msg);
                    return;
                }
            },
            function failure(res){
                console.log(res.data);
                var msg = "Ooops! Well this is embarrassing. ";
                msg += "Something went wrong trying to download " + datasetName;
                msg += ". Please try again later.";
                var code = res.status;
                $location.url('/error?errCode=' + code + '&errText=' + msg);
                return;
            }
        );
    };

    $scope.isSafeToRemove = function(datasetName, dataSetID){
        if (datasetName == "" || datasetName == null) return false;
        DataService.hasLinkedTrendProfiles(dataSetID).then(
            function success(res){
                if (res.status == 200 && res.data != undefined && JSON.parse(res.data).isLinked == "true"){
                    return false; // it is unsafe because it has links
                } else {
                    return true; // it is safe because it has no links
                }
            },
            function failure(res){
                console.log(res.data);
                var msg = "Ooops! Well this is embarrassing. ";
                msg += "Something went wrong trying to check linked ";
                msg += "trend profiles of the following dataset: " + datasetName;
                var code = res.status;
                $location.url('/error?errCode=' + code + '&errText=' + msg);
                return false;
            }
        );
    };

    $scope.removeDataset = function (datasetName, dataSetID){
        DataService.removeDataset(dataSetID).then(
            function success(res){
                if (res.status == 200 && res.data == "success"){
                    $scope.getDatasets();
                } else {
                    console.log(res.data);
                    var msg = "Ooops! Well this is embarrassing. ";
                    msg += "Something went wrong trying to delete ";
                    msg += "the following dataset: " + datasetName;
                    msg += ". Please try again later.";
                    var code = 400;
                    $location.url('/error?errCode=' + code + '&errText=' + msg);
                    return false;
                }
            },
            function failure(res){
                console.log(res.data);
                var msg = "Ooops! Well this is embarrassing. ";
                msg += "Something went wrong trying to delete ";
                msg += "the following dataset: " + datasetName;
                msg += ". Please try again later.";
                var code = res.status;
                $location.url('/error?errCode=' + code + '&errText=' + msg);
                return false;
            }
        );
    };

    $scope.deleteDataset = function(datasetName, datasetID){
        if (datasetName == "" || datasetName == null) return;
        if ($scope.isSafeToRemove(datasetName, datasetID) == false){
            var msg = "Ooops! Well this is embarrassing. ";
            msg += "Something went wrong trying to delete ";
            msg += "the following dataset: " + datasetName;
            msg += ". Please try again later.";
            var code = 400;
            $location.url('/error?errCode=' + code + '&errText=' + msg);
            return;
        }
        $scope.removeDataset(datasetName, datasetID);
        return;
    };

    $scope.getUserName = function(userEmail){
        if ($scope.userEmail != userEmail) {
            $location.url('/logout');
            return;
        }
        UserService.getUserName(userEmail).then(
            function success(res){
                if(res.status == 200){
                    $scope.userFullname = JSON.parse(res.data[0]).fullname;
                } else {
                    console.log("User auth failed in get user name");
                    console.log(res);
                    $location.url('/logout');
                    return;
                }
            },
            function failure(res){
                console.log("User auth failed in get user name");
                console.log(res);
                $location.url('/logout');
                return;
            }
        );
    };

    $scope.getStats = function(dataSetID){
        DataService.getStats(dataSetID).then(
            function success(res){
                console.log('Successfully retrieved stats for ' + dataSetID);
                console.log(res.data);
            },
            function err(res){
                console.log('Failed to retrieve stats for ' + dataSetID);
            }
        );
    };

    $scope.uploadFiles = function(kind) {
        $scope.fileToUp.progress = 0;

        if($scope.fileToUp != null){
            $scope.fileToUp.upload = Upload.upload({
                url: '/upload',
                data: {
                    file: $scope.fileToUp,
                    userEmail: sessionStorage.getItem("userEmail"),
                    kind: kind
                }
            });

            $scope.fileToUp.upload.then(
            function (evt) {
                $scope.fileToUp.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                console.log($scope.fileToUp.progress);
            },
            function (res) {
                $scope.fileToUp.result = res.data;
                $scope.downloadDataset(res.data.dataset_name, res.data.dataset_id);
            },
            function (res) {
                if (res.status > 0)
                    $scope.errorMsg = res.status + ': ' + res.data;
            });
        }
    };


    /* Main */
    var unbind = $rootScope.$on('activeUser', function(event, data){
        $scope.userEmail = data;
        $scope.getUserName(data);
    });

    $scope.$on('$destroy', unbind);

    if ($scope.userEmail == ""){
        $scope.userEmail = sessionStorage.getItem("userEmail");
        $scope.getUserName($scope.userEmail);
    }

    if ($location.path() == "/my_datasets"){
        $scope.getDatasets();
    }
}]);
