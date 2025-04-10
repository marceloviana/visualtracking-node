const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
mongoose.connect(process.env.MONGO_URI, {});
const { TrackingSchema } = require('./schemas/TrackingSchema');
const Track = mongoose.model('Tracking', TrackingSchema);


const addTrack = async (data) => {

  let dataModel = await Track.findOne({transactionId: data.transactionId})

  if (dataModel){
    if (data.transactionId == dataModel.transactionId) {
      
      data.tracking.map(item => dataModel.tracking.push(item))
      return await dataModel.updateOne(dataModel)
    }
  }
  return await Track.insertOne(data)
}

module.exports = {
  addTrack
}
