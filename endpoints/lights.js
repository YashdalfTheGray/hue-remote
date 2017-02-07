const request = require('request-promise');
const _ = require('lodash');

const { convert, mapStateObject } = require('../util');

const getLightsRoot = (req, res) => {
    const hueUser = process.env.HUE_BRIDGE_USERNAME;
    const hueBridge = process.env.HUE_BRIDGE_ADDRESS;

    request({
        method: 'GET',
        url: 'http://' + hueBridge + '/api/' + hueUser + '/lights',
        json: true
    }).then(result => {
        res.json(result);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
};

const getLightsId = (req, res) => {
    const hueUser = process.env.HUE_BRIDGE_USERNAME;
    const hueBridge = process.env.HUE_BRIDGE_ADDRESS;

    request({
        method: 'GET',
        url: 'http://' + hueBridge + '/api/' + hueUser + '/lights/' + req.params.id,
        json: true
    }).then(result => {
        res.json({
            id: req.params.id,
            state: mapStateObject(result.state),
            name: result.name,
            uniqueId: result.uniqueid
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
};

const postLightsIdState = (req, res) => {
    const hueUser = process.env.HUE_BRIDGE_USERNAME;
    const hueBridge = process.env.HUE_BRIDGE_ADDRESS;
    const validKeys = ['on', 'color', 'colorTemp', 'colorloop'];

    const validRequest = Object.keys(req.body).reduce((acc, k) => acc || validKeys.indexOf(k) !== -1, false);

    let params = {};

    params.on = req.body.on;

    if (req.body.color) {
        const hueColor = convert.rgbToHue(req.body.color);

        params = _.assign(params, {
            hue: hueColor[0],
            sat: hueColor[1],
            bri: hueColor[2],
            effect: 'none'
        });
    }
    else if (req.body.colorTemp) {
        params = _.assign(params, {
            ct: convert.rgbToHue(req.body.colorTemp),
            effect: 'none'
        });
    }
    else if (req.body.colorloop) {
        params.effect = 'colorloop';
    }

    if (validRequest) {
        request({
            method: 'PUT',
            url: 'http://' + hueBridge + '/api/' + hueUser + '/lights/' + req.params.id + '/state',
            body: params,
            json: true
        }).then(result => {
            res.json(result);
        }).catch(err => {
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
