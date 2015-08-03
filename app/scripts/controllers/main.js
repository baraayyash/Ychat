'use strict';

/**
 * @ngdoc function
 * @name ang1App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ang1App
 */
angular.module('ang1App')
  .controller('MainCtrl', function ($scope, $q) {

       var conversations = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/conversations");
       var def = $q.defer();
       conversations.orderByChild('lastTimeActive').on('child_changed', function(snap) {
        console.log("changed!");
        updateValue();
       });

    var getConverstaions = function() {
        var conversations = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/conversations");
       var def = $q.defer();
       conversations.orderByChild('lastTimeActive').on('value', function(snap) {
          var records = [];
          snap.forEach(function(ss) {
             records.push( ss.val() );
          });
          def.resolve(records);
       });
        return def.promise;
    };

    var getUser = function(udid) {
        var user = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/users/" + udid + "");
             var def = $q.defer();
            user.on('value', function(snap) {
              var records = [];
              snap.forEach(function(ss) {
                 records.push( ss.val() );
              });
              def.resolve(records);
           });
        return def.promise;
    };

    $scope.convs = {};

    var updateValue = function () {getConverstaions().then(function(results) {
        // $scope.convs = results;
        var conversations = [];
        results.forEach(function(result) {
            getUser(result.udid).then(function(user) {
                result.user = user;
                conversations.push(result);
                $scope.convs = conversations;
            });
        });
    });};

    getConverstaions().then(function(results) {
        // $scope.convs = results;
        var conversations = [];
        results.forEach(function(result) {
            getUser(result.udid).then(function(user) {
                result.user = user;
                conversations.push(result);
                $scope.convs = conversations;
            });
        });
    });

   // setInterval(function () { $scope.$apply(); }, 1000);



    $scope.things = [
      {"id" : "0", "title" : "HTML5 Boilerplate"},
     {"id" : "1", "title" : "HTML5 Boilerplate1"},
     {"id" : "2", "title" : "HTML5 Boilerplate2"}
    ];

  });
