const sendToFronendController = async (websocketInstance, requestBody) => {
    websocketInstance.emit('GERAL', requestBody)
}

module.exports = {
    sendToFronendController
}