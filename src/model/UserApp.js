const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
mongoose.connect(process.env.MONGO_URI, {});
const { UserAppSchema } = require('./schemas/UserAppSchema');
const UserApp = mongoose.model('UserApp', UserAppSchema);


const createAppToken = async (data, token) => {

  return await UserApp.insertOne({userApp: data.email, appName: data.appName, token: token})
}

const checkCardinality = async (token) => {

  return await UserApp.findOne({token: token})
}


module.exports = {
  createAppToken,
  checkCardinality
}
