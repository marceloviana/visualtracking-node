const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
mongoose.connect(process.env.MONGO_URI, {});
const { TrackingSchema } = require('./schemas/TrackingSchema');

const Track = mongoose.model('Tracking', TrackingSchema);

const addTrack = async (data) => {
  
  // filter for user's userApp.
  let dataModel = await Track.findOne({transactionId: data.transactionId, userApp: data.userApp, appName: data.appName})
  
  if (dataModel){
    if (data.transactionId == dataModel.transactionId) {
      
      data.tracking.map(item => dataModel.tracking.push(item))
      dataModel['updatedAt'] = Date.now()
      return await Track.findOneAndUpdate({_id: dataModel._id}, dataModel, {new: true})
    }
  }

  return await Track.insertOne(data)
}

const getTrack = async (filter = undefined, sortArg = {}, limitArg = null) => {
  
  if (!filter) return null
  console.log('filter:: ', filter, sortArg, limitArg)
  // let dataModel = await Track.find(filter).sort(sortArg).limit(limitArg)

  let dataModel = await Track.aggregate([
    {
      $match: filter
    },
    {
      $addFields: {
        tracking: {
          $sortArray: {
            input: "$tracking",
            sortBy: { createdAt: -1 } // 1 para ordem crescente, -1 para decrescente
          }
        }
      }
    }
  ])  

  return dataModel
}

module.exports = {
  addTrack,
  getTrack
}
