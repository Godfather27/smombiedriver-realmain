Meteor.methods({
    'createRoom'() {
        let room_id = makeId();
        Rooms.insert({room_id : room_id, app_connected: false});
        console.log("Room created: " + room_id);
        return room_id;
    },
    'joinRoom'({room_id}) {
        console.log("Trying to connect to room with id: " + room_id);
        let room = Rooms.findOne({room_id: room_id});
        if (room) {
            Rooms.update({room_id: room_id}, { $set: { app_connected: true } });
            return true;
        } else {
            throw new Meteor.Error("Room not found");
        }
    },
    'checkAnswer'({answer_id, input_answer, room_id}) {
        // get answer from collection / json array
        let correct_answer = "";
        if (correct_answer === input_answer) {
            Points.upsert({room_id : room_id}, { $inc: { points: 1 } });
            return Points.findOne({room_id: room_id}).points;
        } else {
            return false;
        }
    }
});

function makeId() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}