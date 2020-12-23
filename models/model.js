const mongoose=require('mongoose');
const {isEmail}= require('validator')
const Schema= mongoose.Schema;

const userSchema= new Schema({
    username: { type: String, 
                required: [true,'Please enter a username'], 
                index: { unique: true } },
    email: { type: String,
             required: [true,'Please enter a email'], 
             index:{ unique: true } ,
             validate:[isEmail,'Please enter a valid email']
            },
    password: { type: String,
                required: [true,'Please enter a password'],
                minlength:[6,'Minimum password length is 6']}
});

userSchema.post('save',function(doc,next){
    console.log("user data saved",doc);
    next();
});

module.exports = mongoose.model('User', userSchema);