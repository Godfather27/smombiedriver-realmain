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
                }
            });
    }
});