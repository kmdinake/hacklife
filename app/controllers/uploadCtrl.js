// app.controller('UploadController', ['$scope', '$route', '$location', function UploadController($scope, $route, $location){

// }]);

// app.controller('UploadController', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {
//     $scope.url = 'uploads';
//     $scope.uploadFiles = function(files, errFiles) {
        
//         console.log('Attempting to upload.');
//         $scope.files = files;
//         $scope.errFiles = errFiles;
//         // if(kind === 'schema'){
//         // 	$scope.url = 'uploads/schema';  
//         // }
//         // else if(kind === 'data'){
//         // 	$scope.url = 'uploads/data';  
//         // }
//         angular.forEach(files, function(file) {
//             file.upload = Upload.upload({
//                 url: $scope.url,
//                 data: {file: file}
//             });

//             file.upload.then(function (response) {
//                 $timeout(function () {
//                     file.result = response.data;
//                 });
//             }, function (response) {
//                 if (response.status > 0)
//                     $scope.errorMsg = response.status + ': ' + response.data;
//             }, function (evt) {
//                 file.progress = Math.min(100, parseInt(100.0 * 
//                                          evt.loaded / evt.total));
//             });
//         });
//     }
// }]);

/*myApp.controller('myCtrl', ['$scope', 'fileUpload', function($scope, fileUpload){
	$scope.uploadFile = function(){
		var file = $scope.myFile;

		console.log('file is ' );
		console.dir(file);

		var uploadUrl = "/fileUpload";
		fileUpload.uploadFileToUrl(file, uploadUrl);
	};
}]);*/