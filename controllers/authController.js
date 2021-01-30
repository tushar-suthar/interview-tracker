const User = require("../models/User");
const jwt = require('jsonwebtoken');
const question = require('../models/question.js');
const topic = require('../models/topics.js');
const company = require('../models/company.js')
const experience = require('../models/experience.js')
const mongoose = require('mongoose');
const express = require('express');
const { db } = require("../models/User");
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

res.render('question' , {question : result})
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

module.exports.question_post = async(req,res) => {
  var a = req.body.top;
  let d= await topic.find({name : a});
  req.body.top = d[0]._id;
  console.log(req.body);
  var data = new question({name : req.body.name , link : req.body.link , topic : req.body.top});
  data.save()
  .then(item => {
    console.log("data is saved");
  })
  .catch(err => {
    console.log(err);
  })
}

module.exports.experience_post = async(req,res) => {
  var a = req.body.comp;
  console.log(req.body);
  let d= await company.find({name : a});
  req.body.comp = d[0]._id;
  // console.log(req.body);
  var data = new experience({img : req.body.image ,name : req.body.name , branch : req.body.branch , year : req.body.year, company : req.body.comp , exp : req.body.experience});
  data.save()
  .then(item => {
    console.log("data is saved");
  })
  .catch(err => {
    console.log(err);
  })
}

module.exports.experience_get =async (req, res) => {
  const str = req.params.name;
  let des=1;
  const data= await company.find({}).lean().exec()
  for(var i = 0;i<data.length;i++){
    const equal = data[i].name;
    if(str.trim() == equal.trim())
    des = data[i]._id;
  }
  const result = await experience.find({company : des})
  console.log(result);
  res.render('experience' , {result})
  }

module.exports.admintopic_get = async(req,res) => {
  const data = await topic.find({});
  res.render('admintopic' , {data});
}

module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

module.exports.signup_post = async (req, res) => {
  const { username , email, password } = req.body;

  try {
    const user = await User.create({ username : username ,email: email,password :  password });
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
