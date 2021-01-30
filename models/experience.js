const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExperienceSchema = new mongoose.Schema({
  img : {
    type : Buffer,
  },
  name : {
    type : String,
  },

  branch : {
    type : String,
  },
  year : {
    type : String,
  },
  company : {
    type: Schema.Types.ObjectId,
    ref : 'company'
  },
  exp : {
      type : String,
  }
});

const Experience = mongoose.model('experience', ExperienceSchema);

module.exports = Experience;
