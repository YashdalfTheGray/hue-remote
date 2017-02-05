const Router = require('express').Router;
const request = require('request-promise');

const checkAuthToken = require('../util/checkAuthToken');
const { mapActionObject } = require('../util/maps');

const groupsRouter = Router(); // eslint-disable-line new-cap

groupsRouter.get('/', checkAuthToken, (req, res) => {
    const hueUser = process.env.HUE_BRIDGE_USERNAME;
    const hueBridge = process.env.HUE_BRIDGE_ADDRESS;

    request({
        method: 'GET',
        url: 'http://' + hueBridge + '/api/' + hueUser + '/groups',
        json: true
    }).then(result => {
        res.json(Object.keys(result).reduce((acc, k) => {
            acc.push({
                id: k,
                name: result[k].name,
                lightIds: result[k].lights,
                state: result[k].state
            });
            return acc;
        }, []));
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

groupsRouter.get('/:id', checkAuthToken, (req, res) => {
    const hueUser = process.env.HUE_BRIDGE_USERNAME;
    const hueBridge = process.env.HUE_BRIDGE_ADDRESS;

    request({
        method: 'GET',
        url: 'http://' + hueBridge + '/api/' + hueUser + '/groups/' + req.params.id,
        json: true
    }).then(result => {
        res.json({
            id: req.params.id,
            name: result.name,
            lightIds: result.lights,
            state: result.state,
            action: mapActionObject(result.action)
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = groupsRouter;
