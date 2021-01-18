const express = require('express');
const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const path=require('path');
const cookieparser=require('cookie-parser');
const mongoose = require('mongoose');
const auth= require('./routes/auth');
const { requireAuth } = require('./middleware/authMiddleware');
const { adminAuth } = require('./middleware/adminMiddleware');
const {User,question,topic}=require('./models/model');
const app=express();
var MongoClient = require('mongodb').MongoClient;


const AdminBroMongoose = require('admin-bro-mongoose');


//connection to database and on port 3000
const mongooseDb = mongoose.connect('mongodb+srv://i:1234567890@cluster0.e4a0p.mongodb.net/Interview_Tracker_Data',{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true})
.then((result)=> {
    AdminBro.registerAdapter(AdminBroMongoose)
    const adminBro = new AdminBro({
        databases: [mongoose],
        rootPath: '/admin',
      });
      const router = AdminBroExpress.buildRouter(adminBro);
      app.use(adminBro.options.rootPath, router);
})
.then((result)=> app.listen(3000))
.catch((err) => console.log(err));





//middleware
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname)));
app.use(express.json());
app.use(cookieparser());
app.use(auth);

app.get('/',(req,res) => {
    res.render('main',{root:__dirname});
    
});
app.get('/home',requireAuth,(req,res) => {
    topic.find({}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
            res.render('home',{'topic' : result});
        }
      });
});

app.get('/topic/:id', function(req, res) {
  var Id = req.params.id;
  question.find({topicName:Id}, function(err, result){
      if(err){
          res.send(err);
      }
      else{
        res.render('file',{'question' : result});
      }
      });
});

app.get('/adminPanel',adminAuth,(req,res)=>{
  res.render('adminPanel');
})