import isString from 'lodash-es/isString';
import rgb from 'color-space/rgb';
import hsv from 'color-space/hsv';

/**
 * validateColorString checks whether a passed in string is in the "#rrggbb"
 * color format
 * @param {string} cs the color string to validate
 */
export const validateColorString = cs => /^#[A-Fa-f0-9]{6}$/.test(cs);

/**
 * validateColorArray checks whether a given array of numbers can represent
 * an array of RGB numbers. Specifically, `|ca| = 3 && ∃ e ∈ ca, 0 ≤ e ≤ 255`
 * @param {number[]} ca the colors array to validate
 */
export const validateColorArray = ca =>
  ca.length === 3 && ca.reduce((acc, cv) => cv >= 0 && cv <= 255);

/**
 * padNumberStrToTwo is a helper function that changes single digit hex number
 * strings from `a` to `0a`.
 * @param {string} ns a string representing a number that needs to be padded
 */
export const padNumberStrToTwo = ns => (ns.length === 1 ? `0${ns}` : ns);

/**
 * rgbStringToRgbArray converts a color string in the format `#rrggbb` to an array
 * in the format `[r, g, b]`
 * @param {string} cs the color, represented as a string, to convert
 */
export const rgbStringToRgbArray = cs => [
  parseInt(cs.substring(1, 3), 16),
  parseInt(cs.substring(3, 5), 16),
  parseInt(cs.substring(5, 7), 16)
];

/**
 * rgbArrayToRgbString converts a color in the format `[r, g, b]` to `#rrggbb`
 * @param {number[]} ca the color, represented as a 3 number array, to convert
 */
export const rgbArrayToRgbString = ca =>
  ca.reduce((acc, n) => acc + padNumberStrToTwo(n.toString(16)), '#');

/**
 * scaleToHueValues scales a color represented by HSV to the scale that
 * Hue bulbs are expecting
 * @param {number[]} hsvArray an array of HSV values
 * @see https://github.com/YashdalfTheGray/hue-remote/blob/master/docs/utils.md#rgbtohue
 */
export const scaleToHueValues = hsvArray => [
  Math.round((hsvArray[0] / hsv.max[0]) * 65535),
  Math.round((hsvArray[1] / hsv.max[1]) * 254),
  Math.round((hsvArray[2] / hsv.max[2]) * 253) + 1
];

/**
 * scaletoHsv converts a color that we get back from the Hue API to HSV
 * @param {number[]} hueArray an array representing a color within the Hue color system
 * @see https://github.com/YashdalfTheGray/hue-remote/blob/master/docs/utils.md#rgbtohue
 */
export const scaleToHsv = hueArray => [
  Math.round((hueArray[0] / 65535) * hsv.max[0]),
  Math.round((hueArray[1] / 254) * hsv.max[1]),
  Math.round((hueArray[2] / 254) * hsv.max[2])
];

/**
 * rgbToHue validates and converts a color from an RGB hex string
 * representation to an array of 3 numbers that the Hue system can understand
 * @param {string} rgbColor an RGB hex string, in the format `#rrggbb`
 * @see https://github.com/YashdalfTheGray/hue-remote/blob/master/docs/utils.md#rgbtohue
 */
export const rgbToHue = rgbColor => {
  let colorArr = [];

  if (!rgbColor) {
    return -1;
  }
  if (
    (isString(rgbColor) && !validateColorString(rgbColor)) ||
    (Array.isArray(rgbColor) && !validateColorArray(rgbColor))
  ) {
    return [];
  }
  if (isString(rgbColor)) {
    colorArr = rgbStringToRgbArray(rgbColor);
  } else if (Array.isArray(rgbColor)) {
    colorArr = rgbColor;
  }

  return scaleToHueValues(rgb.hsv(colorArr));
};

/**
 * convertHueToRgbArray converts a color from the Hue color system into an
 * array of 3 numbers representing an RGB color
 * @param {number[]} hue an array representing a color in the Hue color system
 */
export const convertHueToRgbArray = hue =>
  hsv.rgb(scaleToHsv(hue)).map(e => Math.round(e));

export const hueToRgbArray = convertHueToRgbArray;

export const hueToRgbString = hue =>
  rgbArrayToRgbString(convertHueToRgbArray(hue));

export const tempToMired = temp =>
  Math.max([153, Math.min([Math.round(1000000 / (temp || 6500)), 500])]);

export const miredToTemp = mired =>
  Math.max([2000, Math.min([Math.round(1000000 / (mired || 154), -2), 6500])]);
