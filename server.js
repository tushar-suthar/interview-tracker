const express = require('express');
const path=require('path');
const mongoose = require('mongoose');
const user = require('./models/model');
const auth= require('./routes/auth');

//connection to database and on port 3000
mongoose.connect('mongodb+srv://defaulter:9876543210@cluster0.yt0yj.mongodb.net/Interview_Tracker_Data',{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true})
.then((result)=> app.listen(3000))
.catch((err) => console.log(err));


const app=express();



app.use(express.static(path.join(__dirname)));
app.use(express.json());

app.get('/',(req,res) => {
    res.sendFile('./pages/main.html',{root:__dirname});
});
app.use(auth);
