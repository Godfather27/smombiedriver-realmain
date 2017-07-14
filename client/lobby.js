Template.lobby.events({
    'click #lobby_submit': function(){
        var room_id = $('#lobby_input_room_id').val();
        Meteor.call('joinRoom',
            {room_id: room_id},
            (err, res) => {
                if (err) {
                    console.log(err.message);
                } else {
                    console.log(res);
                    Session.set("room_id", room_id);
                }
            });
    },
    'click #lobby_add_points': function(){
        Meteor.call('checkAnswer',
            {answer_id: "ABC", input_answer: "", room_id: Session.get("room_id")},
            (err, res) => {
                if (err) {
                    console.log(err.message);
                } else {
                    console.log(res);
                }
            });
    }
});

Template.lobby.helpers({
    'joined_room': function() {
        return Session.get("room_id");
    }
});