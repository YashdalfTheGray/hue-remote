const _ = require('lodash');

const convert = require('./convert');

const mapFromActionObject = a => {
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
    mapFromActionObject: mapFromActionObject,
    mapFromStateObject: s => _.assign({}, mapFromActionObject(s), { reachable: s.reachable })
};
