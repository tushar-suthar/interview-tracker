const User =require('./models/model');
const handleError=(err)=>{
    console.log(err.message,err.code);
    let error={email:'',password:''};
    if(err.code=== 11000){
        errors.email='This email is already registered';
        return errors;
    }

    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => 
            {
            error[properties.path]=properties.message;
        });
    }
    return errors;
}




module.exports.signup_get = (req,res) =>{
    res.sendFile('./pages/signup.html',{root:__dirname});
}
module.exports.signup_post = async(req,res) =>{
    const {email,password} =req.body;

    try{
        const user =await User.create({email,password});
        res.status(201);
    }
    catch(err){
        const errors= handleError(err)
        res.status(404).json({errors});
    }
}
    
module.exports.signin_get = (req,res) =>{
    res.sendFile('./pages/signin.html',{root:__dirname});
}
module.exports.signin_post = (req,res) =>{
    
}