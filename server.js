const express = require('express');
const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const path=require('path');
const cookieparser=require('cookie-parser');
const mongoose = require('mongoose');
const auth= require('./routes/auth');
const { requireAuth, checkUser,findexp } = require('./middleware/authMiddleware');
const { adminAuth } = require('./middleware/adminMiddleware');
const {User,question,topic,Experiance}=require('./models/model');
const app=express();
const fs=require('fs');
var multer = require("multer");




var storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
  }
});
var upload = multer({ storage: storage }).single('image');

const AdminBroMongoose = require('admin-bro-mongoose');


//connection to database and on port 3000
mongoose.connect('mongodb+srv://i:1234567890@cluster0.e4a0p.mongodb.net/Interview_Tracker_Data',{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true})
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



app.get('*', checkUser);
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

app.get('/topic/:name',requireAuth, async function(req, res) {
  var name = req.params.name;
   topic.find({topicName:name},function(err,data){
        var Id= data[0]._id;
        question.find({topicName:Id}, function(err, result){
            if(err){
                res.send(err);
            }
            else{
              res.render('file',{'question' : result});
            }
            });
  
});
});


app.get('/admindashboard',adminAuth,(req,res)=>{
  res.render('adminboard');
})
app.get('/adminquestions',adminAuth,(req,res)=>{
  question.find({}, function(err, result){
    if(err){
        res.send(err);
    }
    else{
      topic.find({}, function(err, topic){
        if(err){
            res.send(err);
        }
        else{
          res.render('adminquestions',{'question' : result,'topic':topic});
        }
        });
    }
    });
})
app.get('/users',adminAuth,(req,res)=>{
  User.find({}, function(err, result){
    if(err){
        res.send(err);
    }
    else{
      res.render('users',{'user' : result});
    }
    });
})
app.get('/admintopics',adminAuth,(req,res)=>{
  topic.find({}, function(err, result){
    if(err){
        res.send(err);
    }
    else{
      //res.status(200).json(result)
      res.render('admintopics',{'topic' : result});
    }
    });
})
app.get('/profile',requireAuth,(req,res)=>{
  res.render('dashboard');
})


app.post('/profile/:id',upload, function(req, res) {
  var Id = req.params.id;
  User.findByIdAndUpdate(Id,{
      image:{
        data: fs.readFileSync(path.join(__dirname + '/uploads/' +req.file.filename)),
        contentType: 'image/png'
      }
  },function(err, result){
      if(err){
          res.send(err);
      }
      else{
        console.log("Saved Image");
        res.redirect('/profile');
      }
      });
});

app.get('/experiance/:id',requireAuth,(req,res) => {
  var Id = req.params.id;
      Experiance.find({company:Id},function(err,data){
            res.render('experiance',{'exp':data,'company':Id});
            //res.status(200).json(data)
      });
      //res.status(200).json(data)

});

app.get('/p',(req,res)=>{
  User.find({},function(err,data){
    
    res.status(200).json(data)
});
})