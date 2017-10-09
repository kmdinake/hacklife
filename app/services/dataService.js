app.factory('DataService', ['$http', function DataService($http){
    var factoryObj = {};

    factoryObj.getUserDatasets = function (userEmail){
        return $http.post('/retrieveDatasets', { userEmail: userEmail });   // queries Neo4j
    };

    factoryObj.changeDatasetAccessMod = function (dataSetID, modifier){
        return $http.post('/changeDatasetAccessMod', { dataSetID: dataSetID, access: modifier });   // queries Neo4j
    };

    factoryObj.removeDataset = function (dataSetID){
        return $http.post('/removeDataset', { dataSetID: dataSetID }); // queries Mongo and Neo4j
    };

    factoryObj.getDataSamples = function (dataSetID){
        return $http.post('/retrieveDataSamples', { dataSetID: dataSetID }); // queries Mongo
    };

    factoryObj.hasLinkedTrendProfiles = function (dataSetID){
        return $http.post('/hasLinkedTrendProfiles', { dataSetID: dataSetID }); // queries Neo4j
    };

    factoryObj.getStats = function(dataSetID){
        return $http.post("/retrieveStats", { dataSetID: dataSetID });
    };

    factoryObj.downloadDataset = function(dataset_id, userEmail){
        return $http.post("/downloadDataset", { dataset_id: dataset_id, userEmail: userEmail });
    };

    return factoryObj;
}]);
