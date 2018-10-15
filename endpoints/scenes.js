const request = require('request-promise');
const { runSerially } = require('../util');

const getScenes = async (req, res) => {
  const hueUser = process.env.HUE_BRIDGE_USERNAME;
  const hueBridge = process.env.HUE_BRIDGE_ADDRESS;

  try {
    const response = await request({
      method: 'GET',
      url: `http://${hueBridge}/api/${hueUser}/scenes`,
      json: true
    });
    res.json(response);
  } catch (e) {
    res.status(500).json(e);
  }
};

const getOneScene = async (req, res) => {
  const hueUser = process.env.HUE_BRIDGE_USERNAME;
  const hueBridge = process.env.HUE_BRIDGE_ADDRESS;

  try {
    const response = await request({
      method: 'GET',
      url: `http://${hueBridge}/api/${hueUser}/scenes/${req.params.id}`,
      json: true
    });
    res.json(response);
  } catch (e) {
    res.status(500).json(e);
  }
};

const deleteOneScene = async (req, res) => {
  const hueUser = process.env.HUE_BRIDGE_USERNAME;
  const hueBridge = process.env.HUE_BRIDGE_ADDRESS;

  try {
    const response = await request({
      method: 'DELETE',
      url: `http://${hueBridge}/api/${hueUser}/scenes/${req.params.id}`,
      json: true
    });
    res.json(response);
  } catch (e) {
    res.status(500).json(e);
  }
};

const runScene = async (req, res) => {
  const hueUser = process.env.HUE_BRIDGE_USERNAME;
  const hueBridge = process.env.HUE_BRIDGE_ADDRESS;

  try {
    const response = await request({
      method: 'GET',
      url: `http://${hueBridge}/api/${hueUser}/scenes/${req.params.id}`,
      json: true
    });
    const responses = await runSerially(
      Object.entries(response.lightstates).map(([id, state]) => () =>
        request({
          method: 'PUT',
          url: `http://${hueBridge}/api/${hueUser}/lights/${id}/state`,
          body: state,
          json: true
        })
      )
    );
    res.json(responses);
  } catch (e) {
    res.status(500).json(e);
  }
};

module.exports = {
  getScenes,
  getOneScene,
  deleteOneScene,
  runScene
};
