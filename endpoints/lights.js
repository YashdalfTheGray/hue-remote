const request = require('request-promise');
const fetch = require('node-fetch');

const { mapFromStateObject, mapToStateObject } = require('../util');

const getLightsRootAsync = async (req, res) => {
  const hueUser = process.env.HUE_BRIDGE_USERNAME;
  const hueBridge = process.env.HUE_BRIDGE_ADDRESS;

  try {
    const response = await fetch(`http://${hueBridge}/api/${hueUser}/lights`, {
      method: 'GET'
    });
    const json = await response.json();
    Object.keys(json).forEach(k => {
      json[k].state = mapFromStateObject(json[k].state);
    });
    res.json(json);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const getLightsId = (req, res) => {
  const hueUser = process.env.HUE_BRIDGE_USERNAME;
  const hueBridge = process.env.HUE_BRIDGE_ADDRESS;

  request({
    method: 'GET',
    url: `http://${hueBridge}/api/${hueUser}/lights/${req.params.id}`,
    json: true
  })
    .then(result => {
      res.json({
        id: req.params.id,
        state: mapFromStateObject(result.state),
        name: result.name,
        uniqueId: result.uniqueid
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
};

const getLightsIdAsync = async (req, res) => {
  const hueUser = process.env.HUE_BRIDGE_USERNAME;
  const hueBridge = process.env.HUE_BRIDGE_ADDRESS;

  try {
    const response = await fetch(
      `http://${hueBridge}/api/${hueUser}/lights/${req.params.id}`,
      {
        method: 'GET'
      }
    );

    const json = await response.json();

    res.json({
      id: req.params.id,
      state: mapFromStateObject(json.state),
      name: json.name,
      uniqueId: json.uniqueid
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const postLightsIdState = (req, res) => {
  const hueUser = process.env.HUE_BRIDGE_USERNAME;
  const hueBridge = process.env.HUE_BRIDGE_ADDRESS;
  const validKeys = ['on', 'color', 'colorTemp', 'colorloop'];

  const validRequest = Object.keys(req.body).reduce(
    (acc, k) => acc || validKeys.indexOf(k) !== -1,
    false
  );

  if (validRequest) {
    request({
      method: 'PUT',
      url: `http://${hueBridge}/api/${hueUser}/lights/${req.params.id}/state`,
      body: mapToStateObject(req.body),
      json: true
    })
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  } else {
    res.status(400).json({
      status: 400,
      message: 'Malformed request body'
    });
  }
};

const postLightsIdStateAsync = async (req, res) => {
  const hueUser = process.env.HUE_BRIDGE_USERNAME;
  const hueBridge = process.env.HUE_BRIDGE_ADDRESS;
  const validKeys = ['on', 'color', 'colorTemp', 'colorloop'];

  const validRequest = Object.keys(req.body).reduce(
    (acc, k) => acc || validKeys.indexOf(k) !== -1,
    false
  );

  if (validRequest) {
    try {
      const response = await fetch(
        `http://${hueBridge}/api/${hueUser}/lights/${req.params.id}/state`,
        {
          method: 'POST',
          body: mapToStateObject(req.body)
        }
      );
      const json = await response.json();
      res.json(json);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  } else {
    res.status(400).json({
      status: 400,
      message: 'Malformed request body'
    });
  }
};

module.exports = {
  getLightsRootAsync,
  getLightsId,
  getLightsIdAsync,
  postLightsIdState,
  postLightsIdStateAsync
};
