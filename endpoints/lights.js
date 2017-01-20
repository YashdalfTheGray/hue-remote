const Router = require('express').Router;
const request = require('request-promise');

const checkAuthToken = require('../util/checkAuthToken');
const convert = require('../util/convert');

const lightsRouter = Router(); // eslint-disable-line new-cap

lightsRouter.get('/', checkAuthToken, (req, res) => {
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
});

lightsRouter.get('/:id', checkAuthToken, (req, res) => {
    const hueUser = process.env.HUE_BRIDGE_USERNAME;
    const hueBridge = process.env.HUE_BRIDGE_ADDRESS;

    request({
        method: 'GET',
        url: 'http://' + hueBridge + '/api/' + hueUser + '/lights/' + req.params.id,
        json: true
    }).then(result => {
        res.json(result);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

lightsRouter.get('/:id/state', checkAuthToken, (req, res) => {
    const hueUser = process.env.HUE_BRIDGE_USERNAME;
    const hueBridge = process.env.HUE_BRIDGE_ADDRESS;

    request({
        method: 'GET',
        url: 'http://' + hueBridge + '/api/' + hueUser + '/lights/' + req.params.id,
        json: true
    }).then(result => {
        res.json(result.state);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

lightsRouter.post('/:id/state', checkAuthToken, (req, res) => {
    const hueUser = process.env.HUE_BRIDGE_USERNAME;
    const hueBridge = process.env.HUE_BRIDGE_ADDRESS;

    let convertedPromise = {};

    if (req.body.state === 'on' && req.body.color) {
        convertedPromise = convert.rgbToHue(req.body.color).then(result => { // eslint-disable-line arrow-body-style
            return {
                on: true,
                hue: result[0],
                sat: result[1],
                bri: result[2],
                effect: 'none'
            };
        }).catch(err => {
            throw {
                status: 400,
                message: err
            };
        });
    }
    else if (req.body.state === 'on' && req.body.colorTemp) {
        convertedPromise = convert.tempToMired(req.body.colorTemp).then(result => { // eslint-disable-line arrow-body-style
            return {
                on: true,
                ct: result,
                bri: 254,
                effect: 'none'
            };
        });
    }
    else if (req.body.colorloop) {
        convertedPromise = Promise.resolve({
            on: true,
            effect: 'colorloop'
        });
    }
    else if (req.body.state === 'on') {
        convertedPromise = Promise.resolve({ on: true });
    }
    else if (req.body.state === 'off') {
        convertedPromise = Promise.resolve({ on: false });
    }
    else {
        convertedPromise = Promise.reject({
            status: 400,
            message: 'Malformed request body'
        });
    }

    convertedPromise.then(params => request({
        method: 'PUT',
        url: 'http://' + hueBridge + '/api/' + hueUser + '/lights/' + req.params.id + '/state',
        body: params,
        json: true
    })).then(result => {
        res.json(result);
    }).catch(err => {
        console.log(err);
        if (err.status === 400) {
            res.status(400).json(err);
        }
        else {
            res.status(500).json(err);
        }
    });
});

module.exports = lightsRouter;
