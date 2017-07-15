Template.lobby.events({
    'click #lobby_submit': function(event, instance){
        var room_id = $('#lobby_input_room_id').val();
        Meteor.call('joinRoom',
            {room_id: room_id},
            (err, res) => {
                if (err) {
                    instance.state.set('error', err.message);
                } else {
                    console.log(res);
                    instance.state.set('correct', true);
                    setTimeout(()=>{
                        Session.set("room_id", room_id);
                    }, 500);
                }
            });
    }
});

Template.lobby.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    this.state.set('correct', false);
    this.state.set('error', false);
    this.state.set('gameStarted', false);

    notificationObserver = Notifications.find().observeChanges({
    added: function(id, fields) {
      if(fields.timestamp < (Date.now() - 100000)) {
        console.log('notification too old')
        return
      }

      switch(fields.notification_type){
        case NotificationTypeEnum.NEW_MESSAGE:
          console.log(id, fields.notification_type)
          nextLevel(that);
          break;
        case NotificationTypeEnum.GAME_OVER:
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
        return Session.get("room_id") && instance.state.get('gameStarted');
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