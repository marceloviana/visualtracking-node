require('dotenv').config()
const {
    GetSecretValueCommand,
    SecretsManagerClient,
  } = require("@aws-sdk/client-secrets-manager");

const secretName = `${process.env.ENVIRONMENT}/websocket-service`
  
module.exports.getSecret = async () => {
    return await new Promise( async (resolve, reject) => {
        const client = new SecretsManagerClient();
        const response = null

        try {
          response = await client.send(
            new GetSecretValueCommand({
              SecretId: secretName,
            }),
          );
        } catch (e) {
          if ( process.env.LOCAL_ENV ) {
            console.warn("Using LOCAL .ENV")
            resolve(process.env.LOCAL_ENV)
          } else {
            reject("No .env found!")
          }
        }
    
        if (response?.SecretString) {
            resolve(response.SecretString);
        }

    })    

  };
