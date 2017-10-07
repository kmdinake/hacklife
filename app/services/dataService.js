app.factory('DataService', ['$http', function DataService($http){
    var factoryObj = {};

    factoryObj.getUserDatasets = function (userEmail){
        return $http.post('/retrieveDatasets', { userEmail: userEmail });   // queries Neo4j
    };

    factoryObj.changeDatasetAccessMod = function (dName, truth_val){
        return $http.post('/changeDatasetAccessMod', { datasetName: dName, "isPublic": truth_val });   // queries Neo4j
    };

    factoryObj.removeDataset = function (dName){
        return $http.post('/removeDataset', { datasetName: dName }); // queries Mongo and Neo4j
    };

    factoryObj.getDataSamples = function (dName){
        return $http.post('/retrieveDataSamples', { datasetName: dName }); // queries Mongo
    };

    factoryObj.hasLinkedTrendProfiles = function (dName){
        return $http.post('/hasLinkedTrendProfiles', { datasetName: dName }); // queries Neo4j
    };

    return factoryObj;
}]);
