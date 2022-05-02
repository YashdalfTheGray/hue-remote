import fetch from 'node-fetch';

import { mapFromActionObject, mapToActionObject } from '../util';

export const getGroupsRootAsync = async (req, res) => {
  const hueUser = process.env.HUE_BRIDGE_USERNAME;
  const hueBridge = process.env.HUE_BRIDGE_ADDRESS;

  try {
    const response = await fetch(`http://${hueBridge}/api/${hueUser}/groups`, {
      method: 'GET'
    });
    const json = await response.json();

    res.json(
      Object.keys(json).reduce((acc, k) => {
        acc.push({
          id: k,
          name: json[k].name,
          lightIds: json[k].lights,
          state: json[k].state
        });
        return acc;
      }, [])
    );
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

export const getGroupsIdAsync = async (req, res) => {
  const hueUser = process.env.HUE_BRIDGE_USERNAME;
  const hueBridge = process.env.HUE_BRIDGE_ADDRESS;

  try {
    const response = await fetch(
      `http://${hueBridge}/api/${hueUser}/groups/${req.params.id}`,
      {
        method: 'GET'
      }
    );

    const json = await response.json();

    res.json({
      id: req.params.id,
      name: json.name,
      lightIds: json.lights,
      state: json.state,
      action: mapFromActionObject(json.action)
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

export const postGroupIdActionAsync = async (req, res) => {
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
        `http://${hueBridge}/api/${hueUser}/groups/${req.params.id}/action`,
        {
          method: 'PUT',
          body: JSON.stringify(mapToActionObject(req.body))
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
