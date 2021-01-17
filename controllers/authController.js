const User = require("../models/User");
const jwt = require('jsonwebtoken');
const question = require('../models/question.js');
const topic = require('../models/topics.js');
const mongoose = require('mongoose');
const express = require('express');
const app = express();


const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };


  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }


  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }


  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }


  if (err.message.includes('user validation failed')) {

    Object.values(err.errors).forEach(({ properties }) => {


      errors[properties.path] = properties.message;
    });
  }

  return errors;
}


const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'net ninja secret', {
    expiresIn: maxAge
  });
};

module.exports.question_get =async (req, res) => {
const str = req.params.name;
let des=1;
const data= await topic.find({}).lean().exec()
for(var i = 0;i<data.length;i++){
  const equal = data[i].name;
  if(str.trim() == equal.trim())
  des = data[i]._id;
}
const result = await question.find({topic : des})

res.render('./topic/stacks' , {question : result})
}

module.exports.topic_get = (req, res) => {
  topic.find({},(err,data) => {
    if(err){
      console.log(err)
    }else{
      //res.locals.ques = data
      res.render('topics',{topic: data});
    }
  })
}

module.exports.question_post = async (req,res) => {
  var data = new question(req.body);
  const d = await topic.find({});
  for(var i=0;i<d.length;i++){
    if(d.name==req.body.topic){
      const des = data._id;
    }
  }
  data.topic = des;
  console.log(data);
  data.save()
  .then(item => {
    console.log("data is saved");
  })
  .catch(err => {
    console.log(err);
  })
}

module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  }
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}
