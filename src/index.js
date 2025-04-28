const { getSecret } = require('./utils/localEnv')
return new Promise(async (resolve) => {
    let waitSecret = setInterval(async() => {
        let secrets = await getSecret()

        console.warn('Awainting SecretsManager...')
        if (secrets) {
            console.warn('SecretsManager is okay!')
            clearInterval(waitSecret)
            for ([key, value]of Object.entries(JSON.parse(secrets))) {
                process.env[key] = value
            }
            console.log(process.env.ROOMS)
            require('./start')
        }

    }, 1000)
    resolve()
})