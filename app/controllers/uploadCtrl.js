app.controller('UploadController', ['$scope', 'Upload', function ($scope, Upload) {
    $scope.url = 'uploads';
    $scope.fileToUp = "";
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
                $scope.fileToUp.displayProgress = $scope.fileToUp.name + ': ' + $scope.fileToUp.progress + '%'; 
                console.log($scope.fileToUp.progress);
            },
            function (res) {
                $scope.fileToUp.result = res.data;
            },
            function (res) {
                if (res.status > 0)
                    $scope.errorMsg = res.status + ': ' + res.data;
            });
        }
    }
}]);
