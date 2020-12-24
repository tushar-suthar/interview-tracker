const express = require('express');
const path=require('path');
const cookieparser=require('cookie-parser');
const mongoose = require('mongoose');
const user = require('./models/model');
const auth= require('./routes/auth');
const { requireAuth } = require('./middleware/authMiddleware');


//connection to database and on port 3000
 mongoose.connect('mongodb+srv://i:1234567890@cluster0.e4a0p.mongodb.net/Interview_Tracker_Data',{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true})
.then((result)=> app.listen(3000))
.catch((err) => console.log(err));


const app=express();


app.use(express.static(path.join(__dirname)));
app.use(express.json());
app.use(cookieparser());

app.get('/',(req,res) => {
    res.sendFile('./pages/main.html',{root:__dirname});
});
app.get('/home',requireAuth,(req,res) => {
    res.sendFile('./pages/home.html',{root:__dirname});
});
app.use(auth);

