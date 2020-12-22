const express = require('express');
const path=require('path');

const app=express();
app.listen(3000);
console.log("Server started");


app.use(express.static(path.join(__dirnamenp)));


app.get('/',(req,res) => {
    res.sendFile('./pages/main.html',{root:__dirname});
});

app.get('/signup',(req,res) => {
    res.sendFile('./pages/signup.html',{root:__dirname});
});

app.get('/signin',(req,res) => {
    res.sendFile('./pages/signin.html',{root:__dirname});
});

app.use((req,res) => {
    res.sendFile('./pages/404.html',{root:__dirname});
});