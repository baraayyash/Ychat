'use strict';

/**
 * @ngdoc function
 * @name ang1App.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the ang1App
 */
angular.module('ang1App')
  .controller('Call', function ($scope, $http, $q) {
            $scope.token = 0;
            $scope.status = 'waiting';
            // $scope.status = 'call';
            $scope.callStatus = 'going';
            $scope.supervisor = 1;
             var calltime = 0;



            $http.get('https://yamsafer-call.herokuapp.com/do').success(function (token) {
               Twilio.Device.setup(token);
                         }); // Note: Should do error checking here.

        var getUser = function(udid) {
            var user = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/users/" + udid + "");
            var def = $q.defer();
            user.once('value', function(snap) {
                def.resolve(snap.val());
            });
            return def.promise;
        };


        var connection;


      Twilio.Device.ready(function (device) {
       // $scope.status = "ready to kick!";
      });

      Twilio.Device.error(function (error) {
       // $scope.status = "erorr"+error.message;
      });

      Twilio.Device.cancel(function (device) {

       $scope.status = 'waiting' ;
       $scope.$apply();
      });

      Twilio.Device.connect(function (conn) {
        // $scope.status = "got a call";
        connection = conn;
      });

      Twilio.Device.disconnect(function (conn) {
        // $scope.status = "call ended";
        $scope.$broadcast('timer-stop');
        $scope.status = 'waiting';
        connection = conn;        $scope.$apply();
      });


      /* Listen for incoming connections */
      Twilio.Device.incoming(function (conn) {


        $scope.status = 'call';
        $scope.callStatus = 'incoming';
        $scope.loading = 1;
       connection = conn;
       getUser(conn.parameters.From).then(function(user) {
                        console.log(user);
                        $scope.user = user;
                        $scope.loading = 0;
                    });

      });

      $scope.accept = function(){connection.accept();$scope.callStatus = 'going' ;
      var time = new Date();

              calltime  = time.getFullYear() + '-' +
                        (((time.getMonth() + 1) < 10) ? ("0" + (time.getMonth() + 1)) : (time.getMonth() + 1)) + '-' + ((time.getDate() < 10) ? ("0" + time.getDate()) : time.getDate()) + " " +
                        time.getHours() + ':' +
                        ((time.getMinutes() < 10) ? ("0" + time.getMinutes()) : (time.getMinutes())) + ':' +
                        ((time.getSeconds() < 10) ? ("0" + time.getSeconds()) : (time.getSeconds()));
        console.log("time : " + time);
        console.log("call time : " + calltime );

  };

      $scope.hangUp = function(){
        $scope.$broadcast('timer-stop');
      connection.disconnect();
      saveCall(connection);

  };

      $scope.ignore = function(){ connection.ignore(); $scope.status = 'waiting'; };

      $scope.isMute = function(){ return connection.isMuted() ;};

        $scope.block = function(udid,flag){
         var user = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/users/" + udid + "");
           if (flag)
                user.child('Blocked').set("blocked");
            else
                user.child('Blocked').set("unblocked");

            getUser(udid).then(function(user) {
                        $scope.user = user;
                    });
     };


     var saveCall = function(connection){

        var calls = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/calls/" );
                    calls.push({
                        From: connection.parameters.From,
                        To: "" + $scope.supervisor,
                        Time : "" + calltime
                    });
     };

      $scope.mute = function(){
       if( connection.isMuted() )
        connection.mute(false);
     else
        connection.mute(true);
      };



  });
