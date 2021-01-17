const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
// const questionroute = require('./routes/questionroute');
const cookieParser = require('cookie-parser');
const { requireAuth, adminAuth, checkUser } = require('./middleware/authMiddleware');
const adminRouter = require('./routes/adminroute');
const { AdminBro } = require('admin-bro');



const app = express();

app.use('/admin',adminRouter)
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());


app.set('view engine', 'ejs');


mongoose.connect('mongodb://firstpro:Test1234@cluster0-shard-00-00.f8x9g.mongodb.net:27017,cluster0-shard-00-01.f8x9g.mongodb.net:27017,cluster0-shard-00-02.f8x9g.mongodb.net:27017/Interview_Tracker_Data?ssl=true&replicaSet=atlas-wy2y8t-shard-0&authSource=admin&retryWrites=true&w=majority',{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true})
.then((result)=> app.listen(3000))
.catch((err) => console.log(err));


app.get('*', checkUser);
app.get('/', (req, res) => res.render('index'));

app.use(authRoutes);
// app.use(questionroute);
