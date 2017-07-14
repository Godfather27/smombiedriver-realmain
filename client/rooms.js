function createRoom() {
    Meteor.call('createRoom', (err, res) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log(res);
            joinRoom(res);
        }
    });
}


function joinRoom(room_id) {
    Meteor.call('joinRoom',
        {room_id: room_id},
        (err, res) => {
            if (err) {
                console.log(err.message);
            } else {
                console.log(res);
            }
        });
}