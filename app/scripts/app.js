'use strict';

/**
 * @ngdoc overview
 * @name ang1App
 * @description
 * # ang1App
 *
 * Main module of the application.
 */
angular
  .module('ang1App', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'popoverToggle',
    'ngtimeago',
    'timer'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/chat/:id', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/call/:id', {
        templateUrl: 'views/call.html',
        controller: 'Call',
        controllerAs: 'call'
      })
      .otherwise({
        redirectTo: '/chat/1'
      })
  });
