const fetch = require('node-fetch');

const { runSerially } = require('../util');

const getScenesAsync = async (req, res) => {
  const hueUser = process.env.HUE_BRIDGE_USERNAME;
  const hueBridge = process.env.HUE_BRIDGE_ADDRESS;

  try {
    const response = await fetch(`http://${hueBridge}/api/${hueUser}/scenes`, {
      method: 'GET'
    });
    res.json(await response.json());
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
    res.json(await response.json());
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
    res.json(await response.json());
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
  getScenesAsync,
  getOneSceneAsync,
  deleteOneSceneAsync,
  runSceneAsync
};
