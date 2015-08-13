'use strict';

angular.module('ang1App')
    .service('chatServices', function($q) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        return {

            getConverstaions: function(conversations, $scope) {

                var def = $q.defer();

                conversations.orderByChild('lastTimeActive').on('value', function(snap) {
                    var records = [];
                    snap.forEach(function(ss) {
                        var v = ss.val();
                        v.lastTimeActive = new Date(v.lastTimeActive);
                        if (v.owner != $scope.supervisor)
                            records.push(v);
                    });
                    def.resolve(records);
                });
                return def.promise;
            },

            getMyConverstaions: function(conversations, $scope) {

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
            },

            getUser: function(udid) {

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
            },

            getLastMessage: function(udid) {

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
            },

            sendMessage: function(id, m, $scope) {

                if (m) {
                    var conv = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/conversations/" + id + "");
                    var time = new Date();


                    var t = time.getFullYear() + '-' +
                        (((time.getMonth() + 1) < 10) ? ("0" + (time.getMonth() + 1)) : (time.getMonth() + 1)) + '-' + ((time.getDate() < 10) ? ("0" + time.getDate()) : time.getDate()) + " " +
                        time.getHours() + ':' +
                        ((time.getMinutes() < 10) ? ("0" + time.getMinutes()) : (time.getMinutes())) + ':' +
                        ((time.getSeconds() < 10) ? ("0" + time.getSeconds()) : (time.getSeconds()));


                    var datetime = time.getDate() + "/" + (time.getMonth() + 1) + "/" + time.getFullYear() + " @ " + time.getHours() + ":" + time.getMinutes() +
                        +time.getSeconds();
                    conv.child('messages').push({
                        body: m,
                        sender: "" + $scope.supervisor,
                        time: t
                    });
                    conv.child('lastTimeActive').set(t);
                    conv.child('seen').set("false");
                }
            }

        }
    });
