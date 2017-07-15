import { Template } from 'meteor/templating';
import './chat.html';
import { ReactiveDict } from 'meteor/reactive-dict';
navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

// replace dialog constant with real questions
let DIALOG;
let ringtone = new Audio('ringtone.mp3');

const fillDialog = () => {
  DIALOG = [
    {question: "Do you know where my toast is?", answer: "It's; in; the toaster."},
    {question: "Happy Birthday Bro!", answer: "Happy; Birthday; to you; too!"},
    {question: "How is the driving test going?", answer: "I think I'm; nailing; it."},
    {question: "What do you think about my outfit?", answer: "I don't; give; a; damn."},
    {question: "Good bye, old friend!", answer: "May; the force; be with; you."},
    {question: "Mr. Smith just was here. He wanted to sell me a toaster, again.", answer: "I told you,; to stay away; from him."},
    {question: "It took me 9 hours to clean up your mess, you pig!", answer: "You make me; want to be; a better man."},
    {question: "All you need is love.", answer: "Love is; all; you; need."},
    {question: "By the way... what did you do to the cat!?", answer: "Two; words:; washing; machine"},
    {question: "Sure, but what is your favourite type of burger?", answer: "They call it; a royale; with cheese."},
    {question: "Do you remeber the famous song from Ray Charles?", answer: "Do you mean; Hit the; road; Jack?"},
    {question: "And what are your plans for today?", answer: "I'm having; an old friend; for dinner."},
    {question: "Really? Tell me more about it!", answer: "What we've got here; is a failure; to communicate."},
    {question: "Honey I lost my wallet, do you know where I put it?", answer: "It's; under the; sofa."},
    {question: "What shall I make for lunch tonight?", answer: "Please cook; me some; eggs."},
    {question: "Would you like to go to wonder wharf this weekend?", answer: "I hate; Mr.; Fischoeder."},
    {question: "Mr. biggles just ate your shoes.", answer: "Red cats; are just; the sweetest."},
    {question: "Did you know that in Germany 2016 3214 people died in car accidents?", answer: "You; only; live; once."},
    {question: "Do you rember the title of the last Batman movie from Christopher Nolan?", answer: "The Dark; Knight; Rises"},
    {question: "How was the movie title based on J. K. Rowling work after the Harry Potter series?", answer: "Fantastic Beasts; and; where; to find them"},
    {question: "What was the first science fiction film from Steven Spielberg?", answer: "Close Encounters; of the; Third Kind"},
    {question: "Help! Our house is on fire!!1", answer: "Please; put it; out."},
    {question: "When will I see you again?", answer: "Maybe; later."},
    {question: "Can you bring some milk on your way home?", answer: "I'm; a little bit; busy; right now."},
    {question: "Do you want some chocolate?", answer: "Please stop; writing; me; messages."},
    {question: "But when will you be home?", answer: "I will; be home; at half past; six."},
    {question: "Lorem ipsum", answer: "dolor; sit; amet"},
    {question: "Another thing... can I borrow your hat?", answer: "I; don't have; a hat."},
    {question: "You left your pants at home!", answer: "That's; the least; of my; problems."},
    {question: "Hi.", answer: "Hi."},
    {question: "Do you need anything?", answer: "A; good; lawyer"},
    {question: "Honey, the computer is broke again. What should I do?", answer: "Have you; tried turning; it off; and on again?"},
    {question: "What was the title of the famous books from J. R. R. Tolkien?", answer: "The Lord; of the Rings"},
    {question: "Dan and Emma did split up again.", answer: "Beauty and; the Beast."},
    {question: "What is the greatest film of all time from UK?", answer: "Monty Python; and; The Holy Grail"},
    {question: "Who ordered chicken wings", answer: "That's; nice of; Mr. Who."},
    {question: "I don't know what to write.", answer: "Then; stop it; please?"},
    {question: "It would be great if not all students would have to enact this musical.", answer: "West; Side; Story?"},
    {question: "Be careful while driving!", answer: "Thanks; for; reminding; me!"},
    {question: "Did I told you about...", answer: "Shut up! I'm; trying to; drive; a car; here!"},
    {question: "A New Hope was the first one, what was the title of the second film?", answer: "The Empire; strikes; back"},
    {question: "Weather will get shitty tomorrow again.", answer: "Singin'; in the; Rain"},
    {question: "Great, thanks!", answer: "What; for?"},
    {question: "Here is a Hannibal Lecter asking for you.", answer: "The Silence; of the; Lambs"},
    {question: "Don't look on the phone all the time you idiot!", answer: "I'm; not!"},
    {question: "Why don't you answer me?", answer: "..."},
    {question: "In which movie does Indiana Jones fight agaist Hitler making his army invincible?", answer: "Raiders; of the; Lost Ark"},
    {question: "Our daughter is going to marry a black guy.", answer: "Back; to the; Future"},
    {question: "Hail, Caesar!", answer: "Veni; vidi; vici"},
    {question: "Best Star Wars game ever?", answer: "Knights; of the; Old Republic"},
    {question: "Please let there be a sequel!", answer: "Beyond; Good; And; Evil"},
    {question: "You fight like a dairy farmer!", answer: "You fight; like; a cow!"},
    {question: "The needs of the many outweigh the needs of the few.", answer: "Live long; and; prosper!"},
    {question: "I found you people in mud huts, you were living in CAVES!", answer: "You can't; kill; the messiah."},
    {question: "Combine Wirt's Leg and a Tome of Town Portal in the Horadric Cube.", answer: "And I will; reach; the Cow Level."},
    {question: "Which city is between Dortmund und Hannover on the A2?", answer: "There is; no city; there."}
  ];
}
let notificationObserver;


// helperfunctions
const randomDialog = () => {
    if(DIALOG.length === 0) {
      fillDialog()
    }
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
  return a.answer.split(';').map(mapStringsToObjects)
}
const nextLevel = (instance) => {
  let nextDialog = randomDialog();

  instance.state.set('chatHistory', [...instance.state.get('chatHistory'), ...nextDialog]);
  instance.state.set('openAnswers', shuffle(normalize(nextDialog[0])));
  instance.state.set('currentQuestion', {answer_id: nextDialog[0].answer_id, solution: normalize(nextDialog[0]).map(flattenObjectArray).join(' ')});
  $("html, body").animate({ scrollTop: $(document).height() }, "slow");
  ringtone.play();
  if (navigator.vibrate) {
    navigator.vibrate([500, 300, 500]);
  }
  instance.state.set('inactive', false);
}
const clearLevel = (instance, correct) => {
  let chatHistory = instance.state.get('chatHistory');
  chatHistory[chatHistory.length-1].isSolved = true;
  chatHistory[chatHistory.length-1].correct = correct ? 'correct' : 'wrong';
  chatHistory[chatHistory.length-1].answer = instance.state.get('chosenAnswers').map(flattenObjectArray).join(" ");
  instance.state.set('chatHistory', chatHistory)
  instance.state.set('textToggle', false);
  instance.state.set('chosenAnswers', []);
  $("html, body").animate({ scrollTop: $(document).height() }, "slow");
  setTimeout(()=>{instance.state.set('inactive', true)},1000);
}
const resetGame = (instance) => {
  fillDialog()
  instance.state.set('textToggle', false);
  instance.state.set('chatHistory', []);
  instance.state.set('openAnswers', []);
  instance.state.set('chosenAnswers', []);
  instance.state.set('inactive', false);
}

Template.t_chat.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  resetGame(this)

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
        case NotificationTypeEnum.GAME_END:
          break;
        case NotificationTypeEnum.GAME_START:
          resetGame(that);
          nextLevel(that);
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
    if(instance.state.get('chosenAnswers').length === 0 && instance.state.get('textToggle')){
      return ""
    } else if(instance.state.get('chosenAnswers').length === 0) {
      return "Your message"
    }
    return instance.state.get('chosenAnswers').map(flattenObjectArray).join(" ")
  }
});

Template.t_chat.events({
    // handle click on "fake Message Input field"
    'click .my-message'(event, instance){
      let chatHistory = instance.state.get('chatHistory')
      instance.state.set('textToggle', !instance.state.get('textToggle'));
      $("html, body").animate({ scrollTop: $(document).height() }, "slow");
    },

    // handle clicks on partial answer divs
    'click .answer'(event, instance){
      let openAnswers = instance.state.get('openAnswers');
      let index = openAnswers.findIndex(e => e.partialAnswer === event.currentTarget.innerText)
      let chosenAnswers = instance.state.get('chosenAnswers');
      instance.state.set('chosenAnswers', [...chosenAnswers, ...openAnswers.splice(index, 1)]);
      instance.state.set('openAnswers', openAnswers);
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }

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
                  if(!res){
                    Meteor.call('notify', Session.get('room_id'), NotificationTypeEnum.WRONG_ANSWER);
                  }
                  clearLevel(instance, res)
                }
            });
      }
    }
});