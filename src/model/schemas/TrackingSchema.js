const mongoose = require('mongoose');

const TrackingSchema = new mongoose.Schema({
  appName: String,
  transactionId: String,
  tracking: [
      {
        _id: false,
        phaseName: String,
        createdAt: { type: Date, default: Date.now}
      }
  ],
  createdAt: {type: Date, default: Date.now},
  updatedAt: { type: Date }
})

module.exports = {
    TrackingSchema
}