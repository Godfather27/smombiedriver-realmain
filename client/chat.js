import { Template } from 'meteor/templating';
import './chat.html';
import { ReactiveDict } from 'meteor/reactive-dict';

// replace dialog constant with real questions
const DIALOG = [
  {_id:'ABCDE', question: 'Is this a question1?', answer: 'This is; the correct; answer for; this question1' },
  {_id:'ABCDF', question: 'Is this a question2?', answer: 'This is; the correct; answer for; this question2' },
  {_id:'ABCDG', question: 'Is this a question3?', answer: 'This is; the correct; answer for; this question3' },
  {_id:'ABCDH', question: 'Is this a question4?', answer: 'This is; the correct; answer for; this question4' }
];

// hilfsfunktionen
const randomDialog = () => {
    return DIALOG.splice(Math.floor(Math.random() * DIALOG.length), 1)
  }
const mapStringsToObjects = e => {
    return { partialAnswer: e }
  }


Template.t_chat.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  let initialDialog = randomDialog();

  // set initial state
  this.state.set('textToggle', false);
  this.state.set('chatHistory', initialDialog);
  this.state.set('openAnswers', initialDialog[0].answer.split('; ').map(mapStringsToObjects));
  this.state.set('chosenAnswers', []);
});

Template.t_chat.helpers({
  messages(){
    let instance = Template.instance();
    return instance.state.get('chatHistory');
  },
  answer(){
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
    return instance.state.get('chosenAnswers').length === 0 ? "Your message" : instance.state.get('chosenAnswers').map(e=>e.partialAnswer).join(" ")
  }
});

Template.t_chat.events({
    // handle click on "fake Message Input field"
    'click .my-message'(event, instance){
      instance.state.set('textToggle', !instance.state.get('textToggle'));
    },

    // handle clicks on partial answer divs
    'click .answer'(event, instance){
      let openAnswers = instance.state.get('openAnswers');
      let index = openAnswers.findIndex(e => e.partialAnswer === event.currentTarget.innerText)
      let chosenAnswers = instance.state.get('chosenAnswers');
      instance.state.set('chosenAnswers', [...chosenAnswers, ...openAnswers.splice(index, 1)]);
      instance.state.set('openAnswers', openAnswers);

      if(instance.state.get('openAnswers').length === 0){
        // handle when all partial answers has been chosen
      }
    }
});