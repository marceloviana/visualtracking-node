const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
mongoose.connect(process.env.MONGO_URI, {});
const { UserAppSchema } = require('./schemas/UserAppSchema');
const { UserSchema } = require('./schemas/UserSchema');

const UserApp = mongoose.model('UserApp', UserAppSchema);
const User = mongoose.model('User', UserSchema);


const createAppToken = async (data, token) => {
  if (await UserApp.findOne({appName: data.appName}).select('_id').lean()) return `${data.appName} already exists`
  return await UserApp.insertOne({userApp: data.email, appName: data.appName, token: token})
}

const checkCardinality = async (token, email) => {
  
  let userApp = await UserApp.findOne({token: token}).select(['userApp', 'appName', 'token']).lean()
  let userId = await User.findOne({email: email}).select('_id').lean()
  try {

    userApp['userId'] = userId._id.toString()
  } catch (error) {
    console.error("An error occurred:", error.message)
    return null
  }

  return userApp
}

const getUserApp = async (data) => {
  return await UserApp.find({userApp: data.email})
}
const deleteUserApp = async (data, dataToken) => {
  console.log(data._id, dataToken.email)
  /*
  This check is important because it prevents a user from maliciously trying to delete an application they do not own.
  */
  let res = await UserApp.findOneAndDelete({
    userApp: dataToken.email,
    _id: data._id
  })
  if ( res ) return "Delete successfully"
  return "Unable to delete"
}


module.exports = {
  createAppToken,
  checkCardinality,
  getUserApp,
  deleteUserApp
}
