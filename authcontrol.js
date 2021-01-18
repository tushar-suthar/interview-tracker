const {User,Admin} =require('./models/model');
const jwt=require('jsonwebtoken');


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

    try{
        const user =await User.create({username,email,password});
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
