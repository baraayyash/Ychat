'use strict';

/**
 * @ngdoc function
 * @name ang1App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ang1App
 */
angular.module('ang1App')
    .controller('MainCtrl', function($scope, $q, chatServices,$http, $routeParams) {


        $scope.supervisor = $routeParams.id;
        $scope.convs = {};
        $scope.myConvs = {};
        $scope.chat = 0;
        $scope.unreadMyConvs = 0;
        $scope.popup = 0;
        $scope.loading = 1;
        $scope.selected = 0;

        // $locationProvider.html5Mode(true);

        // var paramValue = $location.search().myParam;
        // console.log("this is it  : " + paramValue);

        $scope.setSelected = function(conv) {
            $scope.selected = conv.udid;
        }


        var conversations = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/conversations");
        var users = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/users");

        var def = $q.defer();

        conversations.orderByChild('lastTimeActive').on('child_changed', function(snap) {
            updateValue();
            if (snap.val().udid == $scope.chat.udid) {
                updateValue1(snap.val().udid);
            }
        });

        users.on('child_changed', function(snap) {

            if ($scope.chat.udid == snap.val().udid) {
                updateValue1($scope.chat.udid);
            }

        });

        conversations.orderByChild('lastTimeActive').once('child_changed', function(snap) {

            var conversation = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/conversations/" + snap.val().udid + "");


            conversation.once('value', function(snap) {
                if ($scope.chat.udid == snap.val().udid) {
                    $scope.showChat(snap.val());
                    updateValue1($scope.chat.udid);
                    //console.log(snap.val());
                }
            });

        });



  var getConverstaions = function() {
            var def = $q.defer();

            conversations.orderByChild('lastTimeActive').on('value', function(snap) {
                var records = [];
                snap.forEach(function(ss) {
                    var v = ss.val();

                    v.lastTimeActive = Date.parse(v.lastTimeActive) ;
                    // console.log('v.lastTimeActive: ', v.lastTimeActive)
                    if (v.owner != $scope.supervisor)
                        records.push(v);
                });
                def.resolve(records);
            });
            return def.promise;
        };

        var getMyConverstaions = function() {
            var def = $q.defer();
            $scope.unreadMyConvs = 0;
            conversations.orderByChild('lastTimeActive').on('value', function(snap) {
                var records = [];
                snap.forEach(function(ss) {

                    var v = ss.val();
                    v.lastTimeActive = new Date(v.lastTimeActive);
                    if (v.owner == $scope.supervisor) {
                        records.push(v);
                        if (ss.val().status == "unread")
                            $scope.unreadMyConvs = $scope.unreadMyConvs + 1;
                    }
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
                    records.push(ss.val());
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
                    records.push(ss.val());
                });
                def.resolve(records);
            });
            return def.promise;
        };

        var updateValue = function() {
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
            });

        };

        var updateValue1 = function(id) {

            getMyConverstaions().then(function(results) {
                var conversations = [];
                results.forEach(function(result) {
                    if (id == result.udid) {
                        console.log("hello");
                        getUser(id).then(function(user) {
                            result.user = user;
                            conversations.push(result);
                            $scope.showChat(result);
                        });
                    }
                });
            });

        };

        getConverstaions().then(function(results) {

            var conversations = [];
            results.forEach(function(result) {
                getUser(result.udid).then(function(user) {
                    result.user = user;
                });
                getLastMessage(result.udid).then(function(user) {
                    result.lastMessage = user;
                    conversations.push(result);
                    $scope.convs = conversations;
                    // console.log($scope.convs);
                });
                $scope.loading = 0;
            });
        });


        getMyConverstaions().then(function(results) {
            var conversations = [];
            results.forEach(function(result) {
                getUser(result.udid).then(function(user) {
                    result.user = user;
                });
                getLastMessage(result.udid).then(function(user) {
                    result.lastMessage = user;
                    conversations.push(result);
                    $scope.myConvs = conversations;
                });
            });

        });


        $scope.showChat = function(conv, flag) {

            var onComplete = function() {
                updateValue();
            };

            var conversation = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/conversations/" + conv.udid + "");
            var def = $q.defer();

            if (flag == 0 && conv.owner == "null") {
                conversation.child('owner').set($scope.supervisor, onComplete());
            }

            if (flag == 1 && conv.owner == "null") {
                conversation.child('status').set('read');
                conversation.child('owner').set($scope.supervisor, onComplete());

            }

            if (conv.owner == $scope.supervisor) {
                conversation.child('status').set('read');
            }

            if (flag == 2 && conv.owner != "null") {
                conversation.child('status').set('read');
            }
            if (conv.owner == "null") {
                conversation.child('owner').set($scope.supervisor, onComplete());
                $scope.selected = conv.udid;
                updateValue1(conv.udid);
            }

            $scope.chat = conv;
        };





        var def = $q.defer();

        conversations.on('child_removed', function(snap) {
            updateValue();
        });



        $scope.sendMessage = function(id, m) {

            chatServices.sendMessage(id, m, $scope);

        };



        $scope.dropConv = function(id) {
            $scope.chat = 0;
            var conversationForUser = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/conversations/" + id + "");
            conversationForUser.child('owner').set("null");
            $scope.selected = 0;
        };

        $scope.blockUser = function(flag, id) {

            var users = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/users/" + id + "");

            if (flag)
                users.child('Blocked').set("blocked");
            else
                users.child('Blocked').set("unblocked");
        };


        $scope.scrollDown = function() {

            $('.scrollbar-dynamic-chat').animate({
                scrollTop: $('.chats').height()
            }, 10, function() {});
        };


    });
