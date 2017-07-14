Meteor.methods({
    'createRoom'() {
        var room_id = makeId();
        Rooms.insert({room_id : room_id, app_connected: false});
        console.log("Room created: " + room_id);
        return room_id;
    },
    'joinRoom'({room_id}) {
        console.log("Trying to connect to room with id: " + room_id);
        var room = Rooms.findOne({room_id: room_id});
        if (room) {
            Rooms.update({room_id: room_id}, { $set: { app_connected: true } });
            return true;
        } else {
            throw new Meteor.Error("Room not found");
        }
    }
});

function makeId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}