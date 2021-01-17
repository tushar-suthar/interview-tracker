const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroMongoose = require('admin-bro-mongoose')
const mongoose = require('mongoose')

AdminBro.registerAdapter(AdminBroMongoose)

const question = require('../models/question.js');
const topic = require('../models/topics.js')

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
  }
]
})

const Topic = require('../models/question.js');


const router = AdminBroExpress.buildRouter(adminBro)

module.exports = router
