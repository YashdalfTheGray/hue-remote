import fetch from 'node-fetch';

import { runSerially } from '../util/index.js';

export const getScenesAsync = async (req, res) => {
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

export const getOneSceneAsync = async (req, res) => {
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

export const deleteOneSceneAsync = async (req, res) => {
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

export const runSceneAsync = async (req, res) => {
  const hueUser = process.env.HUE_BRIDGE_USERNAME;
  const hueBridge = process.env.HUE_BRIDGE_ADDRESS;

  try {
    const response = await fetch(
      `http://${hueBridge}/api/${hueUser}/scenes/${req.params.id}`,
      {
        method: 'GET'
      }
    );
    const jsonBody = await response.json();
    const responses = await runSerially(
      Object.entries(jsonBody.lightstates)
        .map(
          ([id, state]) =>
            () =>
              fetch(`http://${hueBridge}/api/${hueUser}/lights/${id}/state`, {
                method: 'PUT',
                body: state
              })
        )
        .map(r => r.json())
    );
    res.json(responses);
  } catch (e) {
    res.status(500).json(e);
  }
};
