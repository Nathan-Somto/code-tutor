const sendResponse = (res, statusCode, body) => {
    const timeStamp = Date.now()

    res.status(statusCode).json({
        timeStamp,
        status: statusCode,
        body
    })
}

module.exports = {
    sendResponse
}