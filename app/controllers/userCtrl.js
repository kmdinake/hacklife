app.controller('UserController', ['$scope', '$location', function UserController($scope, $location){
    /* User Attributes */
    $scope.userEmail = "";
    $scope.userFullname = "Keoagile";
    /* each dataset has the following schema:
        {
            datasetID: -1,
            datasetName: "",
            attributes: [],
            recordCount: -1,
            uploadDate: "", dd/mm/yyyy
            trendProfileHistory: [] -> { trendProfileID: -1, nr_clusters: -1, algorithmName: "", dateGenerated: "" }
        }
    */
    $scope.datasets = [];
    $scope.activeDataset = null;
    $scope.showTrendProfileHistory = false;

    /* Helper Methods */

    $scope.showTrendHistory = function(val){
        $scope.showTrendProfileHistory = val;
    };

    $scope.setActiveDataset = function(dataset){
        $scope.activeDataset = dataset;
        if($scope.showTrendProfileHistory === true){
            $scope.showTrendHistory(false);
        }
    };

    $scope.goRouteTo = function(route){
        console.log(route);
        $location.path(route);
    };

    $scope.getDatasets = function(){
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

    $scope.getDatasets();
}]);
