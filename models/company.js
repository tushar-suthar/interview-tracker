const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new mongoose.Schema({
  name : {
    type : String
  },
  link : {
    type : String,
  }
});

const Company = mongoose.model('company', companySchema);

module.exports = Company;
