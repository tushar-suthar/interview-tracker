const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
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

userSchema.post('save', function (doc, next) {
    console.log('new user was created & saved', doc);
    next();
  });
  
  // fire a function before doc saved to db
  userSchema.pre('save', async function (next) {
    const salt =await bcrypt.genSalt();
    this.password= await bcrypt.hash(this.password,salt);
    next();
  });


  //method fog logging in user
  userSchema.statics.signin =async function(email,password){
    const user=await this.findOne({email});
    if (user){
      const auth =await bcrypt.compare(password,user.password);
      if(auth){
        return user;
      }
      throw Error("Incorrect Password");
    }
    throw Error("Incorrect Email");
  }
  const User = mongoose.model('user', userSchema);

  module.exports = User;