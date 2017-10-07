app.factory('DataService', ['$http', function DataService($http){
    var factoryObj = {};

    factoryObj.getUserDatasets = function (userEmail){
        return $http.post('/retrieveDatasets', { userEmail: userEmail });
    };

    return factoryObj;
}]);
