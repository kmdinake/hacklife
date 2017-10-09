app.factory('DataService', ['$http', function DataService($http){
    var factoryObj = {};

    factoryObj.getUserDatasets = function (userEmail){
        return $http.post('/retrieveDatasets', { userEmail: userEmail });   // queries Neo4j
    };

    factoryObj.changeDatasetAccessMod = function (dName, modifier){
        return $http.post('/changeDatasetAccessMod', { datasetName: dName, access: modifier });   // queries Neo4j
    };

    factoryObj.removeDataset = function (dName){
        return $http.post('/removeDataset', { datasetName: dName }); // queries Mongo and Neo4j
    };

    factoryObj.getDataSamples = function (dataSetID){
        return $http.post('/retrieveDataSamples', { dataSetID: dataSetID }); // queries Mongo
    };

    factoryObj.hasLinkedTrendProfiles = function (dName){
        return $http.post('/hasLinkedTrendProfiles', { datasetName: dName }); // queries Neo4j
    };

    factoryObj.getStats = function(dataSetID){
        return $http.post("/retrieveStats", { dataSetID: dataSetID });
    };

    factoryObj.downloadDataset = function(dName, userEmail){
        return $http.post("/downloadDataset", { datasetName: dName, userEmail: userEmail });
    };

    return factoryObj;
}]);
