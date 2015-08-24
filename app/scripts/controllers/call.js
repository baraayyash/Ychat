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


            // $http.get('http://localhost:3000/twilio/token').success(function (token) {
            //     $scope.token = token;
            //    console.log(token); // Setup our Twilio device with the token.
            //    // Twilio.Device.setup(token);
            // }); // Note: Should do error checking here.

            $http.get('https://yamsafer-call.herokuapp.com/do').success(function (token) {

               console.log(token); // Setup our Twilio device with the token.
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

      Twilio.Device.connect(function (conn) {
        // $scope.status = "got a call";
        connection = conn;
      });

      Twilio.Device.disconnect(function (conn) {
        // $scope.status = "call ended";
        connection = conn;
      });

      /* Listen for incoming connections */
      Twilio.Device.incoming(function (conn) {
        $scope.status = 'call';
        $scope.callStatus = 'incoming';
        $scope.loading = 1;
       console.log("got a call");
       connection = conn;
       console.log(conn.parameters);
       getUser(conn.parameters.From).then(function(user) {
                        console.log(user);
                        $scope.user = user;
                        $scope.loading = 0;
                    });
        // accept the incoming connection and start two-way audio
      });

      $scope.accept = function(){connection.accept();$scope.callStatus = 'going' ;};

      $scope.hangUp = function(){ Twilio.Device.disconnectAll();};

      $scope.ignore = function(){ Twilio.Device.ignore();};

     $scope.isMute = function(){ return connection.isMuted() ;};



      $scope.mute = function(){
       if( connection.isMuted() )
        connection.mute(false);
    else
        connection.mute(true);
      };



  });
