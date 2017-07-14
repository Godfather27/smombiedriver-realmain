Meteor.methods({
    'createRoom' : function() {
        var room_id = makeId();
        Rooms.insert({room_id : room_id, app_connected: false});
        console.log("Room created: " + room_id);
        return room_id;
    }
});

function makeId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}