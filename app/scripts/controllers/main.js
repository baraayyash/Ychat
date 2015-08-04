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

        $scope.superviser =1;

       var conversations = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/conversations");
       var def = $q.defer();

       conversations.orderByChild('lastTimeActive').on('child_changed', function(snap) {
       // console.log("changed!");
        updateValue();
       });

       //  var messages = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/conversations/32948/messages");
       // var def = $q.defer();
       // messages.orderByChild('lastTimeActive').on('child_added', function(snap) {
       //  console.log("changed!");
       //         var conversations = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/conversations/32948");
       // var def = $q.defer();
       // conversations.orderByChild('lastTimeActive').on('value', function(snap) {
       // // console.log("changed!");
       //  $scope.showChat(snap.val());
       // });
       // });

    var getConverstaions = function() {
        var conversations = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/conversations");
       var def = $q.defer();

       conversations.orderByChild('lastTimeActive').on('value', function(snap) {
          var records = [];
          snap.forEach(function(ss) {
            var v = ss.val();
            v.lastTimeActive = new Date(v.lastTimeActive );
            if(v.owner == "null" )
             records.push( v );
          });
          def.resolve(records);
       });
        return def.promise;
    };

        var getMyConverstaions = function() {
        var conversations = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/conversations");
       var def = $q.defer();

       conversations.orderByChild('lastTimeActive').on('value', function(snap) {
          var records = [];
          snap.forEach(function(ss) {
            var v = ss.val();
            v.lastTimeActive = new Date(v.lastTimeActive );
            if(v.owner == $scope.superviser )
             records.push( v );
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

    var getLastMessage = function(udid) {
        var user = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/conversations/" + udid + "/messages");
             var def = $q.defer();
            user.orderByChild('time').limitToLast(1).on('value', function(snap) {
              var records = [];
              snap.forEach(function(ss) {
                 records.push( ss.val() );
              });
              def.resolve(records);
           });
        return def.promise;
    };

    $scope.convs = {};
    $scope.myConvs = {};
    $scope.chat= {};

    var updateValue = function () {
      getConverstaions().then(function(results) {
        // $scope.convs = results;
        var conversations = [];
        results.forEach(function(result) {
            getUser(result.udid).then(function(user) {
                result.user = user;
               // conversations.push(result);
                //$scope.convs = conversations;
            });
            getLastMessage(result.udid).then(function(user) {
                result.lastMessage = user;
                conversations.push(result);
                $scope.convs = conversations;
            });
        });
        //console.log(results);
    });
};

    getConverstaions().then(function(results) {

        // $scope.convs = results;
        var conversations = [];
        results.forEach(function(result) {
            getUser(result.udid).then(function(user) {
                result.user = user;
               // conversations.push(result);
                //$scope.convs = conversations;
            });
            getLastMessage(result.udid).then(function(user) {
                result.lastMessage = user;
                conversations.push(result);
                $scope.convs = conversations;
            });
        });
        console.log(results);
    });


    getMyConverstaions().then(function(results) {
        console.log("my conv");
        // $scope.convs = results;
        var conversations = [];
        results.forEach(function(result) {
            getUser(result.udid).then(function(user) {
                result.user = user;
               // conversations.push(result);
                //$scope.convs = conversations;
            });
            getLastMessage(result.udid).then(function(user) {
                result.lastMessage = user;
                conversations.push(result);
                $scope.myConvs = conversations;
            });
        });
        console.log(results);
    });

   // setInterval(function () { $scope.$apply(); }, 1000);

 $scope.showChat = function(conv){

    $scope.chat = conv;
    console.log("show");

    var conversation = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/conversations/"+ conv.udid+"");

    conversation.child('status').set('read');
 };


var conversationsnew = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/conversations");




       var def = $q.defer();
       conversationsnew.on('child_added', function(snap) {
       // console.log("changed!");
        updateValue();
       });

              conversationsnew.on('child_removed', function(snap) {
       // console.log("changed!");
        updateValue();
       });


jQuery(document).ready(function() {
   Metronic.init(); // init metronic core componets
   Layout.init(); // init layout
   QuickSidebar.init(); // init quick sidebar
   Demo.init(); // init demo features
   Index.init();
   Index.initDashboardDaterange();
   Index.initCalendar(); // init index page's custom scripts
   Index.initCharts(); // init index page's custom scripts
   Index.initChat();
   Index.initMiniCharts();
   Tasks.initDashboardWidget();
 });




    $scope.things = [
      {"id" : "0", "title" : "HTML5 Boilerplate"},
     {"id" : "1", "title" : "HTML5 Boilerplate1"},
     {"id" : "2", "title" : "HTML5 Boilerplate2"}
    ];




 });