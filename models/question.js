const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new mongoose.Schema({
  name : {
    type : String
  },
  link : {
    type : String,
  },
  topic : {
    type: Schema.Types.ObjectId,
    ref : 'topics'
  }
});

const Question = mongoose.model('questions', questionSchema);

module.exports = Question;
