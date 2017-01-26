const Router = require('express').Router;
const request = require('request-promise');
const _ = require('lodash');

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
});

module.exports = lightsRouter;
