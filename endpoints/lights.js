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

    res.json(Object.assign(json, { state: mapFromStateObject(json.state) }));
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
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
  getLightsIdAsync,
  postLightsIdStateAsync
};
