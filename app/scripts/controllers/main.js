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

   $scope.supervisor =1;
    $scope.convs = {};
    $scope.myConvs = {};
    $scope.chat= 0 ;



       var conversations = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/conversations");
        var m = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/conversations/messages");

       var def = $q.defer();

       conversations.orderByChild('lastTimeActive').on('child_changed', function(snap) {
       //console.log("changed!");
          //   snap.forEach(function(ss) {
          //   var v = ss.val();
          //   v.lastTimeActive = new Date(v.lastTimeActive );
          //   if(v.owner == $scope.supervisor )
          //    records.push( v );
          // });
        updateValue();
       });

        conversations.orderByChild('lastTimeActive').once('child_changed', function(snap) {
       // console.log("changed!");
       console.log("new chiled added!");
    //   console.log(snap.val());

    var conv1 = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/conversations/"+ snap.val().udid +"");


           conv1.on('value', function(snap) {
       if($scope.chat.udid == snap.val().udid){
       $scope.showChat(snap.val());
        console.log("scope changed");
    console.log(snap.val());
    }
       });


    //    if($scope.chat.udid == snap.val().udid){
    //     $scope.chat = {};
    //    $scope.showChat(snap.val());
    //     console.log("scope changed");
    // console.log(snap.val());
    // }
       // updateValue();
       });


        conversations.orderByChild('lastTimeActive').once('child_added', function(snap) {

              if($scope.chat.udid == snap.val().udid){
        $scope.chat = {};
       $scope.showChat(snap.val());
        console.log("newwwwwww child !!!!!!!");
    console.log(snap.val());
    }

       // updateValue();
       });
       //  var messages = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/conversations/123458/messages");
       // var def = $q.defer();
       // messages.orderByChild('lastTimeActive').on('child_added', function(snap) {
       //  console.log("changed!");
       //         var conversations = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/conversations/123458");
       // var def = $q.defer();
       // conversations.orderByChild('lastTimeActive').on('value', function(snap) {
       //  console.log("changed!");
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
            if(v.owner != $scope.supervisor )
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
            if(v.owner == $scope.supervisor )
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
    });


    getMyConverstaions().then(function(results) {
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
        //console.log(results);
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
       // console.log(results);
    });

   // setInterval(function () { $scope.$apply(); }, 1000);

 $scope.showChat = function(conv,flag){

    $scope.chat = conv;

    var conversation = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/conversations/"+ conv.udid+"");
        var def = $q.defer();

    if(flag == 0 && conv.owner == "null"){
    conversation.child('owner').set($scope.supervisor);
    }

    if(flag == 1 && conv.owner){
    conversation.child('status').set('read');
    conversation.child('owner').set($scope.supervisor);
    }

    if(flag == 2 && conv.owner != "null"){
    conversation.child('status').set('read');
    }

// $.delay(1000, function(){
//    $('.scrollbar-dynamic').animate({

//      scrollTop: $('.chats').height()
//    }, 1000, function() {
//    });});


   $('.scrollbar-dynamic').animate({

     scrollTop: $('.chats').height()
   }, 10, function() {
   });

 console.log($('.chats').height());
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



   $scope.sendMessage = function(id,m){

    if(m){
    var conv = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/conversations/"+ id +"");
    var time = new Date();
var datetime =  time.getDate() + "/"
                                       + (time.getMonth()+1)  + "/"
                                       + time.getFullYear() + " @ "
                                       + time.getHours() + ":"
                                       + time.getMinutes();
    conv.child('messages').push({ body: m, sender: ""+$scope.supervisor,time: datetime});
    //$scope.messageBody = " ";
        conv.on('value', function(snap) {
       if($scope.chat.udid == snap.val().udid){
       $scope.showChat(snap.val());
        console.log("scope changed");
    console.log(snap.val());

       console.log("height = "+ $('.chats').height())
   $('.scrollbar-dynamic').animate({

     scrollTop: $('.chats').height()
   }, 10000, function() {
   });
    }
       });
    }

   };




   $scope.dropConv = function(id){


    $scope.chat = 0;

    var conversation = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/conversations/"+ id+"");
        var def = $q.defer();


    conversation.child('owner').set("null");


   };


   $scope.scrollDown = function(){

    console.log("shit !! ");

       $('.scrollbar-dynamic').animate({

     scrollTop: $('.chats').height()
   }, 10, function() {
   });

   };

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