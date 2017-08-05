const request = require('request-promise');

const { mapFromStateObject, mapToStateObject } = require('../util');

const getLightsRoot = (req, res) => {
    const hueUser = process.env.HUE_BRIDGE_USERNAME;
    const hueBridge = process.env.HUE_BRIDGE_ADDRESS;

    request({
        method: 'GET',
        url: `http://${hueBridge}/api/${hueUser}/lights`,
        json: true
    }).then((result) => {
        Object.keys(result).forEach((k) => {
            result[k].state = mapFromStateObject(result[k].state);
        });
        res.json(result);
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
};

const getLightsId = (req, res) => {
    const hueUser = process.env.HUE_BRIDGE_USERNAME;
    const hueBridge = process.env.HUE_BRIDGE_ADDRESS;

    request({
        method: 'GET',
        url: `http://${hueBridge}/api/${hueUser}/lights/${req.params.id}`,
        json: true
    }).then((result) => {
        res.json({
            id: req.params.id,
            state: mapFromStateObject(result.state),
            name: result.name,
            uniqueId: result.uniqueid
        });
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
};

const postLightsIdState = (req, res) => {
    const hueUser = process.env.HUE_BRIDGE_USERNAME;
    const hueBridge = process.env.HUE_BRIDGE_ADDRESS;
    const validKeys = ['on', 'color', 'colorTemp', 'colorloop'];

    const validRequest = Object.keys(req.body).reduce((acc, k) => acc || validKeys.indexOf(k) !== -1, false);

    if (validRequest) {
        request({
            method: 'PUT',
            url: `http://${hueBridge}/api/${hueUser}/lights/${req.params.id}/state`,
            body: mapToStateObject(req.body),
            json: true
        }).then((result) => {
            res.json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    }
    else {
        res.status(400).json({
            status: 400,
            message: 'Malformed request body'
        });
    }
};

module.exports = {
    getLightsRoot,
    getLightsId,
    postLightsIdState
};
