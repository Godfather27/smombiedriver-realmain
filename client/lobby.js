Template.lobby.events({
    'click #lobby_submit': function(event, instance){
        var room_id = $('#lobby_input_room_id').val();
        Meteor.call('joinRoom',
            {room_id: room_id},
            (err, res) => {
                if (err) {
                    instance.state.set('error', err.message);
                } else {
                    instance.state.set('correct', true);
                    Session.set("room_id", room_id);
                }
            });
    }
});

Template.lobby.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    this.state.set('correct', false);
    this.state.set('error', false);
    this.state.set('gameStarted', false);

    let that = this;

    notificationObserver = Notifications.find().observeChanges({
        added: function(id, fields) {
            if(fields.room_id !== Session.get('room_id') || fields.solved) {
                return
            }

            switch(fields.notification_type){
                case NotificationTypeEnum.NEW_MESSAGE:
                    break;
                case NotificationTypeEnum.GAME_OVER:
                    break;
                case NotificationTypeEnum.GAME_START:
                    that.state.set('gameStarted', true);
                    Meteor.call('solveNotification', {id})
                    notificationObserver.stop();
                    break;
                default:
                    Meteor.Error("unexpected notification")
            }
        }
    });

    Meteor.call('getRoom',
        (err, res) => {
            if (err) {
                instance.state.set('error', err.message);
            } else {
                console.log(res);
            }
        });
});

Template.lobby.helpers({
    'joined_room'() {
        let instance = Template.instance();
        return Session.get("room_id") && instance.state.get('gameStarted')
    },
    'error'(){
        let instance = Template.instance();
        return instance.state.get('error');
    },
    'correct'(){
        let instance = Template.instance();
        return instance.state.get('correct');
    }
});