const _ = require('lodash');
const rgb = require('color-space/rgb');
const hsv = require('color-space/hsv');

const validateColorString = cs => /^#[A-Fa-f0-9]{6}$/.test(cs);
const validateColorArray = ca => ca.length === 3 && ca.reduce((acc, cv) => cv >= 0 && cv <= 255);

const padNumberStr = ns => (ns.length === 1 ? '0' + ns : ns); // eslint-disable-line no-extra-parens

const convertToRgbArray = cs => [
    parseInt(cs.substr(1, 2), 16),
    parseInt(cs.substr(3, 2), 16),
    parseInt(cs.substr(5, 2), 16)
];

const convertToRgbString = ca => ca.reduce((acc, n) => acc + padNumberStr(n.toString(16)), '#');

const scaleToHueValues = hsvArray => [
    _.round(hsvArray[0] / hsv.max[0] * 65535),
    _.round(hsvArray[1] / hsv.max[1] * 254),
    _.round(hsvArray[2] / hsv.max[2] * 253) + 1
];

const scaleToHsv = hueArray => [
    _.round(hueArray[0] / 65535 * hsv.max[0]),
    _.round(hueArray[1] / 254 * hsv.max[1]),
    _.round(hueArray[2] / 254 * hsv.max[2])
];

const convertRgbToHue = rgbColor => {
    let colorArr = [];

    if (!rgbColor) {
        return -1;
    }
    else if ((_.isString(rgbColor) && !validateColorString(rgbColor)) || (_.isArray(rgbColor) && !validateColorArray(rgbColor))) {
        return [];
    }
    else if (_.isString(rgbColor)) {
        colorArr = convertToRgbArray(rgbColor);
    }
    else if (_.isArray(rgbColor)) {
        colorArr = rgbColor;
    }

    return scaleToHueValues(rgb.hsv(colorArr));
};

const convertHueToRgbArray = hue => hsv.rgb(scaleToHsv(hue)).map(e => _.round(e));

module.exports = {
    rgbStringToRgbArray: convertToRgbArray,
    rgbArrayToRgbString: convertToRgbString,
    rgbToHue: convertRgbToHue,
    hueToRgbArray: hue => convertHueToRgbArray(hue),
    hueToRgbString: hue => convertToRgbString(convertHueToRgbArray(hue)),
    tempToMired: temp => _.max([153, _.min([_.round(1000000 / (temp ? temp : 6500)), 500])]),
    miredToTemp: mired => _.max([2000, _.min([_.round(1000000 / (mired ? mired : 154), -2), 6500])])
};
