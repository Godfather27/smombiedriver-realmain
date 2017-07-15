import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  Notifications.remove({})
});
