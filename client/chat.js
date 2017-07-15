import { Template } from 'meteor/templating';
import './chat.html';
import { ReactiveDict } from 'meteor/reactive-dict';
navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

// replace dialog constant with real questions
const DIALOG = [
  {answer_id:'ABCDE', question: 'Is this a question1?', answer: 'This is; the correct; answer for; this question1' },
  {answer_id:'ABCDF', question: 'Is this a question2?', answer: 'This is; the correct; answer for; this question2' },
  {answer_id:'ABCDG', question: 'Is this a question3?', answer: 'This is; the correct; answer for; this question3' },
  {answer_id:'ABCDH', question: 'Is this a question4?', answer: 'This is; the! ,correct; .answer for; this question4' }
];
let notificationObserver;


// helperfunctions
const randomDialog = () => {
    return DIALOG.splice(Math.floor(Math.random() * DIALOG.length), 1)
  }
const mapStringsToObjects = e => {
    return { partialAnswer: e.trim() }
  }
const flattenObjectArray = e=> {
    return e.partialAnswer
  }
const shuffle = (a) => {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
    return a;
}
const normalize = (a) => {
  return a.answer.toLowerCase().replace(/[\!\,\.]/g,'').split(';').map(mapStringsToObjects)
}
const nextLevel = (instance) => {
  let nextDialog = randomDialog();

  instance.state.set('chatHistory', [...instance.state.get('chatHistory'), ...nextDialog]);
  instance.state.set('openAnswers', shuffle(normalize(nextDialog[0])));
  instance.state.set('currentQuestion', {answer_id: nextDialog[0].answer_id, solution: normalize(nextDialog[0]).map(flattenObjectArray).join(' ')});
  $("html, body").animate({ scrollTop: $(document).height() }, "slow");

  if (navigator.vibrate) {
    navigator.vibrate([500, 300, 500]);
  }
  // instance.state.set('inactive', false);
}
const clearLevel = (instance) => {
  let chatHistory = instance.state.get('chatHistory');
  chatHistory[chatHistory.length-1].isSolved = true;
  chatHistory[chatHistory.length-1].answer = instance.state.get('chosenAnswers').map(flattenObjectArray).join(" ");
  instance.state.set('chatHistory', chatHistory)
  instance.state.set('textToggle', false);
  instance.state.set('chosenAnswers', []);
  $("html, body").animate({ scrollTop: $(document).height() }, "slow");
  //setTimeout(()=>{instance.state.set('inactive', true)},500);
}

Template.t_chat.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  let initialDialog = randomDialog();
  // set initial state
  this.state.set('textToggle', false);
  this.state.set('chatHistory', initialDialog);
  this.state.set('openAnswers', shuffle(normalize(initialDialog[0])));
  this.state.set('chosenAnswers', []);
  this.state.set('currentQuestion', {answer_id: initialDialog[0].answer_id, solution: normalize(initialDialog[0]).map(flattenObjectArray).join(' ')})
  // this.state.set('inactive', false);

  let that = this
  // Listen for new Notifications
  notificationObserver = Notifications.find().observeChanges({
    added: function(id, fields) {
      if(fields.room_id !== Session.get('room_id') || fields.solved) {
        return
      }

      switch(fields.notification_type){
        case NotificationTypeEnum.NEW_MESSAGE:
          nextLevel(that);
          Meteor.call('solveNotification', {id})
          break;
        case NotificationTypeEnum.GAME_OVER:
          break;
        default:
          Meteor.Error("unexpected notification")
      }
    }
  });
});

Template.t_chat.helpers({
  inactive(){
    let instance = Template.instance();
    return instance.state.get('inactive');
  },
  messages(){
    let instance = Template.instance();
    return instance.state.get('chatHistory');
  },
  answers(){
    let instance = Template.instance();
    return instance.state.get('openAnswers')
  },
  textToggle() {
    let instance = Template.instance();
    return instance.state.get('textToggle');
  },
  selectedMessage() {
    let instance = Template.instance();
    // show default message if no answer is selected yet
    return instance.state.get('chosenAnswers').length === 0 ? "Your message" : instance.state.get('chosenAnswers').map(flattenObjectArray).join(" ")
  }
});

Template.t_chat.events({
    // handle click on "fake Message Input field"
    'click .my-message'(event, instance){
      let chatHistory = instance.state.get('chatHistory')
      /* ------------------- REMOVE THIS WHEN HOOKED UP WITH DRIVING GAME ----------------------- */
      if(chatHistory[chatHistory.length-1].isSolved){
        Meteor.call('notify', {room_id: Session.get('room_id'), notification_type: NotificationTypeEnum.NEW_MESSAGE, solved: false })
      }
      /* ------------------- REMOVE THIS WHEN HOOKED UP WITH DRIVING GAME ----------------------- */
      instance.state.set('textToggle', !instance.state.get('textToggle'));
    },

    // handle clicks on partial answer divs
    'click .answer'(event, instance){
      let openAnswers = instance.state.get('openAnswers');
      let index = openAnswers.findIndex(e => e.partialAnswer === event.currentTarget.innerText)
      let chosenAnswers = instance.state.get('chosenAnswers');
      instance.state.set('chosenAnswers', [...chosenAnswers, ...openAnswers.splice(index, 1)]);
      instance.state.set('openAnswers', openAnswers);

      // clear level if all answers have been chosen
      if(instance.state.get('openAnswers').length === 0){
        Meteor.call('checkAnswer',
            {
              answer_id: instance.state.get('currentQuestion').answer_id,
              input_answer: instance.state.get('chosenAnswers').map(flattenObjectArray).join(" "),
              correct_answer: instance.state.get('currentQuestion').solution,
              room_id: Session.get("room_id")
            },
            (err, res) => {
                if (err) {
                    console.log(err.message);
                } else {
                    clearLevel(instance)
                }
            });
      }
    }
});