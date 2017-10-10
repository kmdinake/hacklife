/*
* ToDo: Main App Component Definition for Trendi Big Data Platform
* Author: K.M. Dinake
* Date: 6 October 2017
*/

var app = angular.module('TrendiApp', ['ngRoute', 'ngFileUpload']);

app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider){
    /*$locationProvider
        .html5Mode(true);*/

    $routeProvider
        .when('/', {
            templateUrl: 'views/landing.html',
            controller: 'TrendiAppController'
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        })
        .when('/register', {
            templateUrl: 'views/register.html',
            controller: 'RegisterController'
        })
        .when('/dashboard', {
            templateUrl: 'views/dashboard.html',
            controller: 'UserController'
        })
        .when('/my_datasets', {
            templateUrl: 'views/my-datasets.html',
            controller: 'UserController'
        })
        .when('/data_tools', {
            templateUrl: 'views/data-tools.html',
            controller: 'UserController'
        })
        .when('/statistics', {
            templateUrl: 'views/statistics.html',
            controller: 'UserController'
        })
        .when('/explore', {
            templateUrl: 'views/explore.html',
            controller: 'UserController'
        })
        .when('/error', {
            templateUrl: 'views/err.html',
            controller: 'ErrController'
        })
        .otherwise({
            redirectTo: '/error'
        });
}]);
