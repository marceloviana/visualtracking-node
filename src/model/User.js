const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
mongoose.connect(process.env.MONGO_URI, {});
const { UserSchema } = require('./schemas/UserSchema');
const User = mongoose.model('User', UserSchema);

const createUser = async (user) => {

  let dataUser = new User(user)
  return await dataUser.save()
}

const login = async ( user ) => {

  let userDoc = await User.findOne({email: user.email})
  if (!userDoc) {
    return `Not found login ${user['email']}`
  }
  
  let password = await bcrypt.compare(user['password'], userDoc.password)
  if (!password) {
    return `Password is incorrect ${password}`
  }

  return userDoc
}

const deleteUser = async (user) => {
  return await User.deleteOne({email: user.email})
}

const deleteManyUser = async (user) => {
  return await User.deleteMany({email: user.email})
}

const updateUser = async (user) => {
  if (!user._id) return "_id isn't defined!"
  
  return await User.updateOne({_id: user._id}, {$set: {user, ...{updatedAt: Date.now()}}})
}

module.exports = {
  createUser,
  login,
  deleteUser,
  deleteManyUser,
  updateUser
}
