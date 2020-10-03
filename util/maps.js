const _ = require('lodash');

const convert = require('./convert');

/**
 * @typedef {Object} HueActionObject
 * @property {boolean} on whether the light is on or off
 * @property {number} bri the currently set Hue-HSV brightness value
 * @property {number} hue the currently set Hue-HSV hue value
 * @property {number} sat the currently set Hue-HSV saturation value
 * @property {string} effect the currently set effect mode
 * @property {number[]} xy the xy coordinates of the currently set color
 * @property {number} ct the mired value of the color temperature
 * @property {string} alert set to either "select" or "lselect" to denote whether the light is alerting
 * @property {string} colormode a string that represents which color representation is currently applied
 */

/**
 * @typedef {Object} HueRemoteActionObject
 * @property {boolean} on whether the light is on or off
 * @property {boolean=} colorloop whether the light is colorlooping or not
 * @property {number=} colorTemp the color temperature of the light in K notation
 * @property {string=} color the color of the light, in the `#rrggbb` hex format
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

module.exports = {
  mapFromActionObject: mapFromActionObject,
  mapFromStateObject: s =>
    _.assign({}, mapFromActionObject(s), { reachable: s.reachable }),
  mapToActionObject: mapToActionObject,
  mapToStateObject: mapToActionObject
};
