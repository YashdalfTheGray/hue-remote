const request = require('request-promise');
const fetch = require('node-fetch');

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

const getScenesAsync = async (req, res) => {
  const hueUser = process.env.HUE_BRIDGE_USERNAME;
  const hueBridge = process.env.HUE_BRIDGE_ADDRESS;

  try {
    const response = await fetch(`http://${hueBridge}/api/${hueUser}/scenes`, {
      method: 'GET'
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

const getOneSceneAsync = async (req, res) => {
  const hueUser = process.env.HUE_BRIDGE_USERNAME;
  const hueBridge = process.env.HUE_BRIDGE_ADDRESS;

  try {
    const response = await fetch(
      `http://${hueBridge}/api/${hueUser}/scenes/${req.params.id}`,
      {
        method: 'GET'
      }
    );
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

const deleteOneSceneAsync = async (req, res) => {
  const hueUser = process.env.HUE_BRIDGE_USERNAME;
  const hueBridge = process.env.HUE_BRIDGE_ADDRESS;

  try {
    const response = await fetch(
      `http://${hueBridge}/api/${hueUser}/scenes/${req.params.id}`,
      {
        method: 'DELETE'
      }
    );
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

const runSceneAsync = async (req, res) => {
  const hueUser = process.env.HUE_BRIDGE_USERNAME;
  const hueBridge = process.env.HUE_BRIDGE_ADDRESS;

  try {
    const response = await fetch(
      `http://${hueBridge}/api/${hueUser}/scenes/${req.params.id}`,
      {
        method: 'GET'
      }
    );
    const responses = await runSerially(
      Object.entries(response.lightstates).map(([id, state]) => () =>
        fetch(`http://${hueBridge}/api/${hueUser}/lights/${id}/state`, {
          method: 'PUT',
          body: state
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
  getScenesAsync,
  getOneScene,
  getOneSceneAsync,
  deleteOneScene,
  deleteOneSceneAsync,
  runScene,
  runSceneAsync
};
