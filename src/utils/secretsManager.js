const {
    GetSecretValueCommand,
    SecretsManagerClient,
  } = require("@aws-sdk/client-secrets-manager");

const secretName = `/1/service/br-websocket-service/${process.env.ENVIRONMENT}/DEFAULT`
  
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
