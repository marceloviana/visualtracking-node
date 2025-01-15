require('dotenv').config()
const {
    GetSecretValueCommand,
    SecretsManagerClient,
  } = require("@aws-sdk/client-secrets-manager");

const secretName = `${process.env.ENVIRONMENT}/websocket-service`
  
module.exports.getSecret = async () => {
    return await new Promise( async (resolve) => {
        const client = new SecretsManagerClient();
        const response = null

        try {
          response = await client.send(
            new GetSecretValueCommand({
              SecretId: secretName,
            }),
          );
        } catch (e) {
          console.warn("Using LOCAL .ENV")
           resolve(process.env.LOCAL_ENV)
        }
    
        if (response?.SecretString) {
            resolve(response.SecretString);
        }

    })    

  };
