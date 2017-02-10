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
    else if (p.colorTemp) {
        return _.assign(params, {
            ct: convert.tempToMired(p.colorTemp),
            effect: 'none'
        });
    }
    else if (p.colorloop) {
        return _.assign(params, { effect: 'colorloop' });
    }

    return params;
};

module.exports = {
    mapFromActionObject: mapFromActionObject,
    mapFromStateObject: s => _.assign({}, mapFromActionObject(s), { reachable: s.reachable }),
    mapToActionObject: mapToActionObject,
    mapToStateObject: mapToActionObject
};
