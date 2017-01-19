const Router = require('express').Router;
const request = require('request-promise');

const checkAuthToken = require('../util/checkAuthToken');

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

module.exports = lightsRouter;
