if (Meteor.isClient) {

  Template.main.getname = function() {
    var k = Meteor.user().profile.name;
    console.log(k);
    return k;
  };

  Template.main.events({
    'click #logout' : function() {
      Meteor.logout()
    }
  });

  Accounts.ui.config({
      requestPermissions: {
        facebook: ['user_likes'],
      },
      passwordSignupFields: 'USERNAME_ONLY'
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    rtc.on('chat_msg', function(data, socket) {
      var roomList = rtc.rooms[data.room] || [];
      console.log(socket);
      for (var i = 0; i < roomList.length; i++) {
        var socketId = roomList[i];

        if (socketId !== socket.id) {
          var soc = rtc.getSocket(socketId);

          if (soc) {
            soc.send(JSON.stringify({
              "eventName": "receive_chat_msg",
              "data": {
                "messages": data.messages,
              "color": data.color
              }
            }), function(error) {
              if (error) {
                console.log(error);
              }
            });
          }
        }
      }
    });
  });
}
