import fetch from 'node-fetch';

import { mapToStateObject, runSerially } from '../util/index.js';

export const getProtocols = async (req, res) => {
  const client = res.locals.redis;

  try {
    const keys = await client.keys('*');
    res.json(keys);
  } catch (e) {
    res.status(500).json(e);
  }
};

export const getOneProtocol = async (req, res) => {
  const client = res.locals.redis;

  try {
    const value = await client.hgetall(req.params.name);

    if (!value) {
      res.sendStatus(404);
    } else {
      res.json(value);
    }
  } catch (e) {
    res.status(500).json(e);
  }
};

export const createProtocol = async (req, res) => {
  const client = res.locals.redis;

  try {
    const value = await client.hmset(req.body.name, req.body.details);
    res.status(201).json(value);
  } catch (e) {
    res.status(500).json(e);
  }
};

export const deleteProtocol = async (req, res) => {
  const client = res.locals.redis;

  try {
    const value = await client.del(req.params.name);
    res.json(value);
  } catch (e) {
    res.status(500).json(e);
  }
};

export const updateProtocol = async (req, res) => {
  const client = res.locals.redis;

  try {
    const value = await client.hmset(req.params.name, req.body);
    res.json(value);
  } catch (e) {
    res.status(500).json(e);
  }
};

export const runProtocolAsync = async (req, res) => {
  const hueUser = process.env.HUE_BRIDGE_USERNAME;
  const hueBridge = process.env.HUE_BRIDGE_ADDRESS;
  const client = res.locals.redis;

  try {
    const protocolToRun = await client.hgetall(req.params.name);

    const responses = await runSerially(
      Object.entries(protocolToRun)
        .map(([id, color]) => {
          if (color.length !== 0) {
            return [id, mapToStateObject({ on: true, color: color })];
          }
          return [id, mapToStateObject({ on: false })];
        })
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
