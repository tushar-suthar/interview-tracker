const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroMongoose = require('admin-bro-mongoose')
const mongoose = require('mongoose')
const question = require('../models/question.js');
const topic = require('../models/topics.js');
const company = require('../models/company.js');
const experience = require('../models/experience.js')

AdminBro.registerAdapter(AdminBroMongoose)

const adminBro = new AdminBro({
  databases: [mongoose],
  rootPath: '/admin',
},
{
  resources : [{
    resource : question
  },
  {
    resource : topic
  },
  {
    resource : company
  },
  {
    resource : experience
  }
]
})

const router = AdminBroExpress.buildRouter(adminBro)

module.exports = router
