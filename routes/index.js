const express = require('express');
const helpers = require('../helpers');
const config = require('../config/config.json');

const router = express.Router();

const getHash = helpers.getHash;
const callGeth = helpers.callGeth;

/* POST sign create. */
router.post('/sign', function(req, res, next) {
    let signature, hash, transaction;

    hash = getHash(req.body);

    callGeth({
            "jsonrpc": "2.0",
            "method": "personal_sign",
            "params": [hash, config.account_address, config.account_password],
            "id": 1
        })
        .then((result) => {
            signature = result.result;

            return callGeth({
                    "jsonrpc": "2.0",
                    "method": "personal_sendTransaction",
                    "params": [{ from: config.account_address, to: config.contract_address, data: signature }, config.account_password],
                    "id": 1
                })
        })
        .then((result) => {
            transaction = result.result;

            res.json({
                transaction,
                hash,
                signature
            })
        })
        .catch((err) => {
            next(err);
        });
});

/* POST sign check. */
router.post('/check-sign', function(req, res, next) {
    const hash = getHash(req.body);

    callGeth({
            "jsonrpc": "2.0",
            "method": "personal_ecRecover",
            "params": [hash, req.body.signature_hash],
            "id": 1
        })
        .then((result) => {
            res.json({
                result: config.account_address === result.result
            })
        })
        .catch((err) => {
            next(err);
        });
});

module.exports = router;
