const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  name : {
    type : String,
  }
});

const Topic = mongoose.model('topics', topicSchema);

module.exports = Topic;
