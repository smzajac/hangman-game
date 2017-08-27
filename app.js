const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const MongoClient = require("mongodb").MongoClient;
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const bodyParser = require('body-parser');
mongoose.Promise = require('bluebird');
const app=express();
const fs = require('fs');
//replace beer
const url = "mongodb://localhost:27017/beer";
mongoose.connect('mongodb://localhost:27017/beer');

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache')
app.set('views', './views');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

// var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g']

const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

let answer = newWord();

let hangMan = {
  word: answer,
  guesses: 8,
  underscore: makeWordUnderscore(),
  displayWord: [],
  usedLetters: [],
  randomValue: [1,2,3]
};

console.log(answer);
console.log(answer.length);


function newWord(){
  let word = words[Math.floor(Math.random()*words.length)];
  return word;
};

function makeWordUnderscore(){
  let display = answer
  display = answer.replace(/./g, '_ ');
    return display;
};

function wordHandler(word, letters) {
  let displayWord = [];
  for (var i = 0; i < word.length; i++) {
    if (letters.includes(word[i])){
      displayWord.push(word[i]);
    }
    else {
      displayWord.push('_');
    }
  }
  return displayWord;
};

app.get('/', function (req, res, next) {
  hangMan.displayWord = wordHandler(hangMan.word, hangMan.usedLetters);
  res.render('index', hangMan);
  console.log(hangMan);
  console.log(hangMan.displayWord);
});


app.get('/lose', function (req, res, next) {
  res.render('lose', hangMan);
});



function displayUsedLetters(letterGuessed) {
  hangMan.usedLetters.push(letterGuessed);
  return hangMan.usedLetters;
};

function appendWordDisplay(){
  if (req.body.guess) {

  }
};

app.post('/letterGuess', function (req, res) {

  // displayUsedLetters(req.body.guess);

  console.log(req.body.guess);
  if(!hangMan.usedLetters.includes(req.body.guess)){
    displayUsedLetters(req.body.guess);
  }

  if(!hangMan.word.includes(req.body.guess)){
    hangMan.guesses -= 1;
  }

  // hangMan.guesses -= 1;
  if (hangMan.guesses > -1 ) {
    res.redirect('/');
  }
  else{
      res.redirect('lose');
      console.log('you lose!');
  }
});


// function add(x, y) {
//   x + y;
// }
// let thisThingwillbe3 = add(1,2);
// console.log(thisThingwillbe3);


app.listen(3000, function () {
  console.log('Successfully started express application!');
})
