const {User,Admin,question,topic,Experiance} =require('./models/model');
const jwt=require('jsonwebtoken');
const fs=require('fs');
const path=require('path');


const handleError=(err)=>{
    console.log(err.message,err.code);
    let errors={username:'',email:'',password:''};

    if(err.message=== 'Incorrect Email'){
        errors.email='This email is not registered';
        return errors;
    }
    if(err.message=== 'Incorrect Password'){
        errors.password='incorrect password';
        return errors;
    }
    if (err.code === 11000) {
        errors.email = 'that email is already registered';
        return errors;
      }

    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => 
            {
            errors[properties.path]=properties.message;
        });
    }
    return errors;
}

const age=24*60*60;
const createtoken=(id) =>{
    return jwt.sign({id},'kisi ko nhi btana',{
        expiresIn:age
    });
}
const admintoken=(id)=>{
    return jwt.sign({id},'admin hoon',{
        expiresIn:age
    });
}


module.exports.signup_get = (req,res) =>{
    res.render('signup',{root:__dirname});
}

module.exports.signup_post = async(req,res) =>{
    const {username,email,password} =req.body;
    image={
        data: fs.readFileSync(path.join(__dirname + '/images/' +'image-1611565328999')),
        contentType: 'image/png'
    }
    try{
        const user =await User.create({username,email,password,image});
        const token= createtoken(user._id);
        res.cookie('jwt',token,{httpOnly:true});
        res.status(201).json({user:user._id});
    }
    catch(err){
        const errors= handleError(err);
        res.status(404).json({errors});
    }
}
    
module.exports.signin_get = (req,res) =>{
    res.render('signin',{root:__dirname});
}


module.exports.signin_post = async(req,res) =>{
    const {email,password}=req.body;
    try{
     const user= await User.signin(email,password);
     const token= createtoken(user._id);
     res.cookie('jwt',token,{httpOnly:true});
     res.status(200).json({user: user._id});
    }
    catch(err){
        const errors = handleError(err);
        res.status(404).json({errors});
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
  }

module.exports.adminAuth_get = (req,res) =>{
    res.render('adminAuth',{root:__dirname});
}


module.exports.adminAuth_post = async(req,res) =>{
    const {email,password}=req.body;
    try{
     const user= await Admin.login(email,password);
     const token= admintoken(user._id);
     res.cookie('jwt',token,{httpOnly:true});
     res.status(200).json({user: user._id});
    }
    catch(err){
        const errors = handleError(err);
        res.status(404).json({errors});
    }
}


module.exports.addquestion_post = async(req,res) =>{
    const {name,linkto,topicName,visible} =req.body;
    try{
        const Question =await question.create({name,linkto,topicName,visible});
        res.status(200);
        res.redirect('/adminquestions');

    }
    catch(err){
        const errors= handleError(err);
        res.status(404).json({errors});
    }
}

module.exports.addtopic_post = async(req,res) =>{
    const {topicName} =req.body;
    console.log(topicName);
    try{
        const Topic =await topic.create({topicName});
        res.status(200);
        res.redirect('/admintopics');
    }
    catch(err){
        const errors= handleError(err);
        res.status(404).json({errors});
    }
}

module.exports.addexperiance_post = async(req,res) =>{
    const {id,company,branch,year,experiance} =req.body;
    User.findById(id,async function(err,result){
        if(err){
            const errors= handleError(err);
            res.status(404).json({errors});
        }
        else{
            const name =result.username;
            const contentType =result.image.contentType;
            const data =result.image.data.toString('base64');
            const exp =await Experiance.create({name,contentType,data,company,branch,year,experiance});
            res.status(200);
            const c="/experiance/"+company;
            res.redirect(c);
        }
    }
    )
}