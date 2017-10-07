app.factory('UserService', ['$http', function($http){
    var userServiceObj = {};

    userServiceObj.register = function(newUser){
        if(newUser == null){ return false; }
        return $http.post("/registerNewUser", {"user": newUser});
    };

    userServiceObj.login = function(user){
    	if(user == null){ return false; }
    	return $http.post("/executeLogin", {"user": user});
    }

    return userServiceObj;
}]);
