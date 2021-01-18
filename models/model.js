const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const {isEmail}= require('validator')
const Schema= mongoose.Schema;

const userSchema= new Schema({
    username: { type: String, 
                required: [true,'Please enter a username'], 
               },
    email: { type: String,
             required: [true,'Please enter a email'], 
             index:{ unique: true } ,
             validate:[isEmail,'Please enter a valid email']
            },
    password: { type: String,
                required: [true,'Please enter a password'],
                minlength:[6,'Minimum password length is 6']}
});

const topicSchema = new Schema({ topicName: 'string'});

const questionSchema = new Schema({ 
  name: 'string',
  linkto: 'string',
  topicName:[{ type: Schema.Types.ObjectId, ref: 'topic' }],
  visible:'bool'
});

const adminSchema= new Schema({
  username: { type: String, 
              required: [true,'Please enter a username'], 
             },
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

  adminSchema.pre('save', async function (next) {
    const salt =await bcrypt.genSalt();
    this.password= await bcrypt.hash(this.password,salt);
    next();
  });

  adminSchema.statics.login =async function(email,password){
    const admin=await this.findOne({email});
    if (admin){
      const auth =await bcrypt.compare(password,admin.password);
      if(auth){
        return admin;
      }
      throw Error("Incorrect Password");
    }
    throw Error("Incorrect Email");
  }



  const User = mongoose.model('user', userSchema);
  const Admin = mongoose.model('admin', adminSchema);
  const topic = mongoose.model('topic', topicSchema);
  const question = mongoose.model('question', questionSchema);

  module.exports = {User,topic,question,Admin};