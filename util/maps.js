const _ = require('lodash');

const convert = require('./convert');

const mapActionObject = a => {
    if (a.effect === 'colorloop') {
        return {
            on: a.on,
            colorloop: true
        };
    }
    else if (a.colormode === 'ct') {
        return {
            on: a.on,
            colorTemp: convert.miredToTemp(a.ct)
        };
    }
    else if (a.colormode === 'hs' || a.colormode === 'xy') {
        return {
            on: a.on,
            color: convert.hueToRgbString([a.hue, a.sat, a.bri])
        };
    }
    return a;
};

module.exports = {
    mapActionObject: mapActionObject,
    mapStateObject: s => _.assign(mapActionObject(s), { reachable: s.reachable })
};
