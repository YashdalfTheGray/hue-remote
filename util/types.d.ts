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
export type HueActionObject = {
  on: boolean;
  bri: number;
  hue: number;
  sat: number;
  effect: string;
  xy: number[];
  ct: number;
  alert: string;
  colormode: string;
};

/**
 * @typedef {Object} HueStateObject
 * @property {boolean} on whether the light is on or off
 * @property {number} bri the currently set Hue-HSV brightness value
 * @property {number} hue the currently set Hue-HSV hue value
 * @property {number} sat the currently set Hue-HSV saturation value
 * @property {string} effect the currently set effect mode
 * @property {number[]} xy the xy coordinates of the currently set color
 * @property {number} ct the mired value of the color temperature
 * @property {string} alert set to either "select" or "lselect" to denote whether the light is alerting
 * @property {string} colormode a string that represents which color representation is currently applied
 * @property {boolean} reachable whether the light is reachable through the Hue bridge
 */
export type HueStateObject = HueActionObject & {
  reachable: boolean;
};

/**
 * @typedef {Object} HueRemoteActionObject
 * @property {boolean} on whether the light is on or off
 * @property {boolean=} colorloop whether the light is colorlooping or not
 * @property {number=} colorTemp the color temperature of the light in K notation
 * @property {string=} color the color of the light, in the `#rrggbb` hex format
 */
export type HueRemoteActionObject = {
  on: boolean;
  colorloop?: boolean;
  colorTemp?: number;
  color?: string;
};

/**
 * @typedef {Object} HueRemoteStateObject
 * @property {boolean} on whether the light is on or off
 * @property {boolean=} colorloop whether the light is colorlooping or not
 * @property {number=} colorTemp the color temperature of the light in K notation
 * @property {string=} color the color of the light, in the `#rrggbb` hex format
 * @property {boolean} reachable whether the light is reachable through the Hue bridge
 */
export type HueRemoteStateObject = {
  on: boolean;
  colorloop?: boolean;
  colorTemp?: number;
  color?: string;
};

type PutResponseSuccess = {
  [key: string]: string | number | boolean;
};

type PostResponseSuccess = {
  id: string;
};

type DeleteResponseSuccess = string;

export type HueResponseObject = {
  success: PutResponseSuccess | PostResponseSuccess | DeleteResponseSuccess;
};
