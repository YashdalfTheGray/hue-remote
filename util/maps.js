const _ = require('lodash');

const convert = require('./convert');

/**
 * @typedef { import("./types").HueActionObject } HueActionObject
 * @typedef { import("./types").HueStateObject } HueStateObject
 * @typedef { import("./types").HueRemoteActionObject } HueRemoteActionObject
 * @typedef { import("./types").HueRemoteStateObject } HueRemoteStateObject
 * @typedef { import("./types").HueResponseObject } HueResponseObject
 */

/**
 * mapFromActionObject changes the state object from the Hue API
 * to match the return object type from hue-remote's API
 * @param {HueActionObject} a the action object to convert from
 * @returns {HueRemoteActionObject} the translated response to be sent back
 */
const mapFromActionObject = a => {
  if (a.effect === 'colorloop') {
    return {
      on: a.on,
      colorloop: true
    };
  }
  if (a.colormode === 'ct') {
    return {
      on: a.on,
      colorTemp: convert.miredToTemp(a.ct)
    };
  }
  if (a.colormode === 'hs' || a.colormode === 'xy') {
    return {
      on: a.on,
      color: convert.hueToRgbString([a.hue, a.sat, a.bri])
    };
  }
  return a;
};

/**
 * mapToActionObject converts a hue remote action object into a hue action object
 * @param {HueRemoteActionObject} p the hue remote action object to convert
 * @returns {HueActionObject} the action object equivalent
 */
const mapToActionObject = p => {
  if (p.on === false) {
    return { on: false };
  }

  const params = { on: p.on };

  if (p.color) {
    const hueColor = convert.rgbToHue(p.color);

    return _.assign(params, {
      hue: hueColor[0],
      sat: hueColor[1],
      bri: hueColor[2],
      effect: 'none'
    });
  }
  if (p.colorTemp) {
    return _.assign(params, {
      ct: convert.tempToMired(p.colorTemp),
      effect: 'none'
    });
  }
  if (p.colorloop) {
    return _.assign(params, { effect: 'colorloop' });
  }

  return params;
};

/**
 * mapFromHueResponseObject stitches together a set of hue response objects
 * into one HueRemoteStateObject.
 * @param {HueResponseObject[]} responses the response object to transform
 * @returns {HueRemoteStateObject} the transformed state object
 */
const mapFromHueResponseObject = responses => {
  return responses.map(r => r.success);
};

module.exports = {
  mapFromActionObject: mapFromActionObject,
  /**
   * mapFromStateObject converts a hue state object into a hue remote state object
   * @param {HueStateObject} s the hue remote state object to convert
   * @returns {HueRemoteStateObject} the state object equivalent
   */
  mapFromStateObject: s =>
    _.assign({}, mapFromActionObject(s), { reachable: s.reachable }),
  mapToActionObject: mapToActionObject,
  mapToStateObject: mapToActionObject,
  mapFromHueResponseObject: mapFromHueResponseObject
};
