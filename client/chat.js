import { Template } from 'meteor/templating';
import './chat.html';

Template.chat.helpers({
  messages: [
    { message: 'Lorem ipsum dolor sit amet', me: false},
    { message: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr', me: false},
    { message: 'This is task 3', me: true},
    { message: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr', me: false},
    { message: 'This is something else', me: true},
    { message: 'Lorem ipsum dolor sit amet', me: false},
    { message: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr', me: false},
    { message: 'This is task 3', me: true},
    { message: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr', me: false},
    { message: 'This is something else', me: true},
  ],
});