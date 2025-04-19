const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
mongoose.connect(process.env.MONGO_URI, {});
const { UserSchema } = require('./schemas/UserSchema');
const User = mongoose.model('User', UserSchema);

const createUser = async (user) => {

  if (await User.findOne({email: user.email})) {
    return `${user['email']} already exists!`
  }
  
  let dataUser = new User(user)
  return await dataUser.save()
}

const login = async ( user ) => {

  let userDoc = await User.findOne({email: user.email})
  if (!userDoc) {
    return `${user['email']} not found login`
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
  user['updatedAt'] = Date.now()
  return await User.findOneAndUpdate({_id: user._id}, user, { new: true })
}

module.exports = {
  createUser,
  login,
  deleteUser,
  deleteManyUser,
  updateUser
}
