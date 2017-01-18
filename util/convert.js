const _ = require('lodash');
const rgb = require('color-space/rgb');
const hsv = require('color-space/hsv');
const Promise = require('bluebird');

const validateColorString = cs => /^#[A-Fa-f0-9]{6}$/.test(cs);
const validateColorArray = ca => ca.length === 3 && ca.reduce((acc, cv) => cv >= 0 && cv <= 255);

const convertToRgbArray = cs => [
    parseInt(cs.substr(1, 2), 16),
    parseInt(cs.substr(3, 2), 16),
    parseInt(cs.substr(5, 2), 16)
];

const scaleToHueValues = hsvArray => [
    _.round(hsvArray[0] / hsv.max[0] * 65535),
    _.round(hsvArray[0] / hsv.max[1] * 254),
    _.round(hsvArray[0] / hsv.max[2] * 253) + 1
];


const convertRgbToHue = rgbColor => new Promise((resolve, reject) => {
    let colorArr = [];

    if (!rgbColor) {
        reject('Missing input');
    }
    else if (_.isString(rgbColor) && !validateColorString(rgbColor)) {
        reject('Malformed RGB string');
    }
    else if (_.isArray(rgbColor) && !validateColorArray(rgbColor)) {
        reject('Malformed RGB array');
    }
    else if (_.isString(rgbColor)) {
        colorArr = convertToRgbArray(rgbColor);
    }
    else if (_.isArray(rgbColor)) {
        colorArr = rgbColor;
    }

    resolve(scaleToHueValues(rgb.hsv(colorArr)));
});

module.exports = {
    rgbToHue: convertRgbToHue,
    tempToMired: temp => _.max([153, _.min([_.round(1000000 / (temp ? temp : 6500)), 500])])
};
