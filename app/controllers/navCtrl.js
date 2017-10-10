/**
 * ToDo: Navbar Controller Definition
 * Author: K.M. Dinake
 * Date: 17 Dec 2016
 */

 app.controller('NavbarController', ['$scope', '$location'/*, 'NavbarService'*/, function NavbarController($scope, $location/*, NavbarService*/){
     /* Main Navbar */
     $scope.menuItems = [
         { "title": "Dashboard", "link":"#/dashboard" },
         { "title": "Datasets", "link": "#/my_datasets" },
         { "title": "Data Tools", "link": "#/data_tools" },
         { "title": "Statistics", "link": "#/statistics" },
         { "title": "Explore", "link": "#/explore" },
         { "title": "Logout", "link": "#/logout" }
     ];

     $scope.main = function(){
          /*NavbarService.checkLogin().then(
               function success(response){
                    if(response.status != 200 || response.data != true){
                         console.log("NavAuth Failed\nErrCode: " + response.status + "\nErrMsg: " + response.statusText);
                         $location.url('#/');
                    }
              },
              function err(response){
                   console.log("NavAuth Failed\nErrCode: " + response.status + "\nErrMsg: " + response.statusText);
                   $location.url('#/');
              }
         );*/
     };
     $scope.main();

 }]);
