app.controller('LoginController', ['$scope', '$route', '$location', 'UserService', function LoginController($scope, $route, $location, UserService){
		$scope.email = "";
		$scope.password = "";

		$scope.executeLogin = function(){
			var user = {};
			user.email = $scope.email;
			user.password = $scope.password;

			UserService.login(user).then(
				function success(response){
		            if(response && response.status == 200 && response.data == "success"){
		                    $location.url('/dashboard');
		                    return true;
	                } 
	                else if(response && response.status == 200 && response.data == "failed"){
		                window.setTimeout(function(){
		                    $route.reload();
		                }, 3000);
		            }
	            },
	            function err(response) {
	                var msg = "Ooops! Well this is embarrasing. Sign Up Failed! ("+response.statusText+')';
	                var code = response.status;
	                window.setTimeout(function(){
	                    $route.reload();
	                }, 3000);
	                $location.url('/error?errCode='+code+'&errText='+msg);
	                return false;
	            }
				);
		}

		$scope.submit = function(){
		    if($scope.email == "" || $scope.password == ""){ return false; }
		    $scope.executeLogin();
		};


}]);
