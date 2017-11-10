const requestPromise = require('request-promise');

const toHex = (string) => {
    let hex = '';
    for (let i = 0; i < string.length; i++) {
        hex += '' + string.charCodeAt(i).toString(16)
    }
    return hex
};

const getHash = (body) => {
    return '0x' + toHex(`user_id=${body.user_id}&document_id=${body.document_id}&signature_request_id=${body.signature_request_id}`)
};

const callGeth = (body) => {
    return requestPromise({
        uri: 'http://localhost:8545',
        body: body,
        json: true,
        method: 'POST'
    }).then((result) => {
        if (!result.result) {
            throw new Error(result.error.message)
        }

        return result;
    })
};

module.exports = {
    getHash,
    callGeth
};