const mongoose = require('mongoose');

const UserAppSchema = new mongoose.Schema({
  userApp: String,
  appName: String,
  token: String,
  createdAt: {type: Date, default: Date.now},
  updatedAt: { type: Date }
})

module.exports = {
    UserAppSchema
}