import { Template } from 'meteor/templating';
import './chat.html';
import { ReactiveDict } from 'meteor/reactive-dict';

const DIALOG = [
  {_id:'ABCDE', question: 'Is this a question1?', answer: 'This is; the correct; answer for; this question1' },
  {_id:'ABCDF', question: 'Is this a question2?', answer: 'This is; the correct; answer for; this question2' },
  {_id:'ABCDG', question: 'Is this a question3?', answer: 'This is; the correct; answer for; this question3' },
  {_id:'ABCDH', question: 'Is this a question4?', answer: 'This is; the correct; answer for; this question4' }
];

const randomDialog = () => DIALOG.splice(Math.floor(Math.random() * DIALOG.length), 1)
const mapStringsToObjects = e => {
    return { partialAnswer: e }
  }


Template.t_chat.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  this.state.set('textToggle', false);
  this.state.set('chatHistory', randomDialog());
  let history = this.state.get('chatHistory');
  history = history[history.length-1].answer.split('; ')
  this.state.set('currentAnswers', history.map(mapStringsToObjects));
});

Template.t_chat.helpers({
  messages(){
    let instance = Template.instance();
    return instance.state.get('chatHistory');
  },
  answer(){
    let instance = Template.instance();
    return instance.state.get('currentAnswers')
  },
  textToggle() {
    let instance = Template.instance();
    return instance.state.get('textToggle');
  }
});

Template.t_chat.events({
    'click .my-message'(event, instance){
      instance.state.set('textToggle', !instance.state.get('textToggle'));
    },
    'click .answer'(event, instance){
      let currentAnswers = instance.state.get('currentAnswers');
      let index = currentAnswers.findIndex(e => e.partialAnswer === event.currentTarget.innerText)
      console.log(index)
      currentAnswers.splice(index, 1)
      instance.state.set('currentAnswers', currentAnswers);
    }
});