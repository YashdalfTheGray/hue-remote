const request = require('request-promise');

const { mapFromActionObject, mapToActionObject } = require('../util');

const getGroupsRoot = (req, res) => {
    const hueUser = process.env.HUE_BRIDGE_USERNAME;
    const hueBridge = process.env.HUE_BRIDGE_ADDRESS;

    request({
        method: 'GET',
        url: `http://${hueBridge}/api/${hueUser}/groups`,
        json: true
    }).then((result) => {
        res.json(Object.keys(result).reduce((acc, k) => {
            acc.push({
                id: k,
                name: result[k].name,
                lightIds: result[k].lights,
                state: result[k].state
            });
            return acc;
        }, []));
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
};

const getGroupsId = (req, res) => {
    const hueUser = process.env.HUE_BRIDGE_USERNAME;
    const hueBridge = process.env.HUE_BRIDGE_ADDRESS;

    request({
        method: 'GET',
        url: `http://${hueBridge}/api/${hueUser}/groups/${req.params.id}`,
        json: true
    }).then((result) => {
        res.json({
            id: req.params.id,
            name: result.name,
            lightIds: result.lights,
            state: result.state,
            action: mapFromActionObject(result.action)
        });
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
};

const postGroupIdAction = (req, res) => {
    const hueUser = process.env.HUE_BRIDGE_USERNAME;
    const hueBridge = process.env.HUE_BRIDGE_ADDRESS;
    const validKeys = ['on', 'color', 'colorTemp', 'colorloop'];

    const validRequest = Object.keys(req.body).reduce((acc, k) => acc || validKeys.indexOf(k) !== -1, false);

    if (validRequest) {
        request({
            method: 'PUT',
            url: `http://${hueBridge}/api/${hueUser}/groups/${req.params.id}/action`,
            body: mapToActionObject(req.body),
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
    getGroupsRoot,
    getGroupsId,
    postGroupIdAction
};
