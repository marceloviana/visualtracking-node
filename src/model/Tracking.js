const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
mongoose.connect(process.env.MONGO_URI, {});
const { TrackingSchema } = require('./schemas/TrackingSchema');

const Track = mongoose.model('Tracking', TrackingSchema);

const addTrack = async (data) => {
  // filter for user's userApp.
  let dataModel = await Track.findOne({transactionId: data.transactionId, userApp: data.userApp, AppName: data.AppName})

  if (dataModel){
    if (data.transactionId == dataModel.transactionId) {
      
      data.tracking.map(item => dataModel.tracking.push(item))
      dataModel['updatedAt'] = Date.now()
      return await Track.findOneAndUpdate({_id: dataModel._id}, dataModel, {new: true})
    }
  }

  return await Track.insertOne(data)
}

const getTrack = async (filter = undefined) => {
  
  if (!filter) return null

  let dataModel = await Track.find(filter)

  return dataModel
}

module.exports = {
  addTrack,
  getTrack
}
