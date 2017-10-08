app.controller('UserController', ['$scope', '$rootScope', '$location', 'UserService', 'DataService', function UserController($scope, $rootScope, $location, UserService, DataService){
    /* User Attributes */
    $scope.userEmail = "";
    $scope.userFullname = "";
    $scope.datasets = [];
    $scope.activeDataset = null;
    $scope.showTrendProfileHistory = false;
    $scope.showingSampleData = false;

    /* Helper Methods */

    $scope.showTrendHistory = function(val){
        $scope.showTrendProfileHistory = val;
    };

    $scope.showSampleData = function(val){
        DataService.getDataSamples($scope.activeDataset.datasetName).then(
            function success(res){
                if (res.status == 200){
                    $scope.activeDataset.dataSamples = res.data;
                } else {
                    console.log(res.data);
                    var msg = "Ooops! Well this is embarrassing. ";
                    msg += "Something went wrong trying to retrieve data samples for ";
                    msg += $scope.activeDataset.datasetName;
                    msg += ". Please try again later.";
                    var code = res.status;
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
        /*DataService.getUserDatasets($scope.userEmail).then(
            function success(res) {
                if (res.status == 200){
                    if (res.data !== undefined && res.data !== null && res.data.my_data !== undefined){
                        $scope.datasets = res.data.my_data;
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
        */
        $scope.datasets = [
            {
                datasetID: 1,
                datasetName: "Iris",
                attributes: ["Petal length", "Petal width", "Sepal length", "Sepal width"],
                recordCount: 170,
                uploadDate: '12/04/2017',
                trendProfileHistory: [
                    { trendProfileID: 1, nr_clusters: 3, algorithmName: "KMeans", dateGenerated: "12/09/2017" },
                    { trendProfileID: 2, nr_clusters: 4, algorithmName: "LVQ", dateGenerated: "12/09/2017" },
                    { trendProfileID: 3, nr_clusters: 3, algorithmName: "KMeans", dateGenerated: "3/10/2017" }
                ]
            },
            {
                datasetID: 2,
                datasetName: "Students",
                attributes: ["Name", "Degree", "Average Study Time", "Likelihood To Pass", "Age"],
                recordCount: 2000,
                uploadDate: '9/10/2017',
                trendProfileHistory: [
                    { trendProfileID: 1, nr_clusters: 4, algorithmName: "KMeans", dateGenerated: "0/09/2017" },
                    { trendProfileID: 2, nr_clusters: 4, algorithmName: "LVQ", dateGenerated: "09/09/2017" },
                    { trendProfileID: 3, nr_clusters: 4, algorithmName: "KMeans", dateGenerated: "03/10/2017" }
                ]
            }
        ];
    };

    $scope.changeAccessMod = function(datasetName, truth_val){
        if (datasetName == "" || datasetName == null || truth_val == null) return;
        DataService.changeDatasetAccessMod(datasetName, truth_val).then(
            function success(res){
                if (res.status == 200 && res.data == "success"){
                    // alert the user that the change succeeded
                    $scope.getDatasets();
                } else {
                    console.log(res.data);
                    var msg = "Ooops! Well this is embarrassing. ";
                    msg += "Something went wrong trying to share your dataset. ";
                    msg += "Please try again later.";
                    var code = res.status;
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

    $scope.downloadDataset = function(datasetName){
        if (datasetName == "" || datasetName == null) return;
        DataService.getDataSamples(datasetName).then(
            function success(res){
                if (res.status == 200){
                    // Deal with the file to download
                } else {
                    console.log(res.data);
                    var msg = "Ooops! Well this is embarrassing. ";
                    msg += "Something went wrong trying to download " + datasetName;
                    msg += ". Please try again later.";
                    var code = res.status;
                    $location.url('/error?errCode=' + code + '&errText=' + msg);
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

    $scope.isSafeToRemove = function(datasetName){
        if (datasetName == "" || datasetName == null) return false;
        DataService.hasLinkedTrendProfiles(datasetName).then(
            function success(res){
                if (res.status == 200 && res.status == "true"){
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

    $scope.removeDataset = function (datasetName){
        DataService.removeDataset(datasetName).then(
            function success(res){
                if (res.status == 200 && res.data == "success"){
                    $scope.getDatasets();
                } else {
                    console.log(res.data);
                    var msg = "Ooops! Well this is embarrassing. ";
                    msg += "Something went wrong trying to delete ";
                    msg += "the following dataset: " + datasetName;
                    msg += ". Please try again later.";
                    var code = res.status;
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

    $scope.deleteDataset = function(datasetName){
        if (datasetName == "" || datasetName == null) return;
        if (!$scope.isSafeToRemove(datasetName)) return;
        $scope.removeDataset(datasetName);
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
                    $scope.userFullname = res.data;
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

    /* Main */
    $rootScope.$on('activeUser', function(event, data){
        $scope.userEmail = data;
        $scope.getUserName(data);
    });

    if ($location.path() == "/my_datasets"){
        $scope.getDatasets();
    }
}]);
