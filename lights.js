const Router = require('express').Router;
const checkAuthToken = require('./checkAuthToken');
const request = require('request-promise');

const lightsRouter = Router(); // eslint-disable-line new-cap

lightsRouter.get('/', checkAuthToken, (req, res) => {
    const hueUser = process.env.HUE_BRIDGE_USERNAME;
    const hueBridge = process.env.HUE_BRIDGE_ADDRESS;

    request({
        method: 'GET',
        url: 'http://' + hueBridge + '/api/' + hueUser + '/lights'
    }).then(result => {
        res.json(JSON.parse(result));
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = lightsRouter;
