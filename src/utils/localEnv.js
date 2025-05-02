require('dotenv').config()
  
module.exports.getSecret = async () => {
    if ( process.env.LOCAL_ENV ) {
      console.warn("Using LOCAL .ENV")
      return process.env.LOCAL_ENV
    } else {
      console.log("No .env found!")
      return null
    }
  };
