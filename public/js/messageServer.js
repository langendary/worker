var message=angular.module("messageServer",[]);
message.factory("message",function () {
      var socket=io.connect('ws://localhost:8080');
      return socket;
})