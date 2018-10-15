const request = require('request-promise');

const { mapToStateObject, runSerially } = require('../util');

const getProtocols = async (req, res) => {
  const client = res.locals.redis;

  try {
    const keys = await client.keysAsync('*');
    res.json(keys);
  } catch (e) {
    res.status(500).json(e);
  }
};

const getOneProtocol = async (req, res) => {
  const client = res.locals.redis;

  try {
    const value = await client.hgetallAsync(req.params.name);

    if (!value) {
      res.sendStatus(404);
    } else {
      res.json(value);
    }
  } catch (e) {
    res.status(500).json(e);
  }
};

const createProtocol = async (req, res) => {
  const client = res.locals.redis;

  try {
    const value = await client.hmsetAsync(req.body.name, req.body.details);
    res.status(201).json(value);
  } catch (e) {
    res.status(500).json(e);
  }
};

const deleteProtocol = async (req, res) => {
  const client = res.locals.redis;

  try {
    const value = await client.delAsync(req.params.name);
    res.json(value);
  } catch (e) {
    res.status(500).json(e);
  }
};

const updateProtocol = async (req, res) => {
  const client = res.locals.redis;

  try {
    const value = await client.hmsetAsync(req.params.name, req.body);
    res.json(value);
  } catch (e) {
    res.status(500).json(e);
  }
};

const runProtocol = async (req, res) => {
  const hueUser = process.env.HUE_BRIDGE_USERNAME;
  const hueBridge = process.env.HUE_BRIDGE_ADDRESS;
  const client = res.locals.redis;

  try {
    const protocolToRun = await client.hgetallAsync(req.params.name);

    const responses = await runSerially(
      Object.entries(protocolToRun)
        .map(([id, color]) => {
          if (color.length !== 0) {
            return [id, mapToStateObject({ on: true, color: color })];
          }
          return [id, mapToStateObject({ on: false })];
        })
        .map(([id, state]) => () =>
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
  getProtocols,
  getOneProtocol,
  createProtocol,
  deleteProtocol,
  updateProtocol,
  runProtocol
};
