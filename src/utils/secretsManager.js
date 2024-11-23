const {
    GetSecretValueCommand,
    SecretsManagerClient,
  } = require("@aws-sdk/client-secrets-manager");

const secretName = `${process.env.ENVIRONMENT}/websocket-service`
  
module.exports.getSecret = async () => {
    return await new Promise( async (resolve) => {
        const client = new SecretsManagerClient();
        const response = await client.send(
          new GetSecretValueCommand({
            SecretId: secretName,
          }),
        );
    
        if (response.SecretString) {
            resolve(response.SecretString);
        }

    })    

  };
