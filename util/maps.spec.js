const test = require('tape');
const _ = require('lodash');

const { mapFromActionObject, mapFromStateObject, mapToActionObject, mapToStateObject } = require('./maps');
const convert = require('./convert');

const baseTestAction = {
    on: true,
    bri: 254,
    hue: 34849,
    sat: 193,
    effect: 'none',
    xy: [0.3230, 0.3278],
    ct: 167,
    alert: 'none'
};

const baseTestState = _.assign({}, baseTestAction, { reachable: true });


test('mapFromActionObject works in colorloop mode', t => {
    const colorLoopTestAction = _.assign({}, baseTestAction, { effect: 'colorloop' });
    const result = mapFromActionObject(colorLoopTestAction);

    t.equal(result.colorloop, true);
    t.equal(result.on, colorLoopTestAction.on);
    t.end();
});

test('mapFromActionObject works in ct mode', t => {
    const ctTestAction = _.assign({}, baseTestAction, { colormode: 'ct' });
    const result = mapFromActionObject(ctTestAction);

    t.equal(result.colorTemp, convert.miredToTemp(ctTestAction.ct));
    t.equal(result.on, ctTestAction.on);
    t.end();
});

test('mapFromActionObject works in hs mode', t => {
    const hsTestAction = _.assign({}, baseTestAction, { colormode: 'hs' });
    const result = mapFromActionObject(hsTestAction);

    t.equal(result.color, convert.hueToRgbString([hsTestAction.hue, hsTestAction.sat, hsTestAction.bri]));
    t.equal(result.on, hsTestAction.on);
    t.end();
});

test('mapFromActionObject works in xy mode', t => {
    const xyTestAction = _.assign({}, baseTestAction, { colormode: 'xy' });
    const result = mapFromActionObject(xyTestAction);

    t.equal(result.color, convert.hueToRgbString([xyTestAction.hue, xyTestAction.sat, xyTestAction.bri]));
    t.equal(result.on, xyTestAction.on);
    t.end();
});

test('mapFromActionObject acts as a passthrough when no interesting properties are found', t => {
    const passTestAction = {
        on: true,
        foo: 'bar'
    };
    const result = mapFromActionObject(passTestAction);

    t.equal(result.foo, passTestAction.foo);
    t.equal(result.on, passTestAction.on);
    t.end();
});

test('mapFromStateObject works in colorloop mode', t => {
    const colorLoopTestState = _.assign({}, baseTestState, { effect: 'colorloop' });
    const result = mapFromStateObject(colorLoopTestState);

    t.equal(result.colorloop, true);
    t.equal(result.on, colorLoopTestState.on);
    t.equal(result.reachable, colorLoopTestState.reachable);
    t.end();
});

test('mapFromStateObject works in ct mode', t => {
    const ctTestState = _.assign({}, baseTestState, { colormode: 'ct' });
    const result = mapFromStateObject(ctTestState);

    t.equal(result.colorTemp, convert.miredToTemp(ctTestState.ct));
    t.equal(result.on, ctTestState.on);
    t.equal(result.reachable, ctTestState.reachable);
    t.end();
});

test('mapFromStateObject works in hs mode', t => {
    const hsTestState = _.assign({}, baseTestState, { colormode: 'hs' });
    const result = mapFromStateObject(hsTestState);

    t.equal(result.color, convert.hueToRgbString([hsTestState.hue, hsTestState.sat, hsTestState.bri]));
    t.equal(result.on, hsTestState.on);
    t.equal(result.reachable, hsTestState.reachable);
    t.end();
});

test('mapFromStateObject works in xy mode', t => {
    const xyTestState = _.assign({}, baseTestState, { colormode: 'xy' });
    const result = mapFromStateObject(xyTestState);

    t.equal(result.color, convert.hueToRgbString([xyTestState.hue, xyTestState.sat, xyTestState.bri]));
    t.equal(result.on, xyTestState.on);
    t.equal(result.reachable, xyTestState.reachable);
    t.end();
});

test('mapFromStateObject acts as a passthrough when no interesting properties are found', t => {
    const passTestState = {
        on: true,
        foo: 'bar'
    };
    const result = mapFromStateObject(passTestState);

    t.equal(result.foo, passTestState.foo);
    t.equal(result.on, passTestState.on);
    t.end();
});

test('mapToActionObject maps off requests correctly', t => {
    t.false(mapToActionObject({ on: false }).on);
    t.assert(mapToActionObject({}).on === undefined);
    t.end();
});

test('mapToActionObject maps on requests correctly', t => {
    t.true(mapToActionObject({ on: true }).on);
    t.end();
});

test('mapToActionObject maps color requests correctly', t => {
    const testState = {
        on: true,
        color: '#00ff00'
    };
    const result = mapToActionObject(testState);

    t.true(result.on);
    t.equal(result.hue, 21845);
    t.equal(result.sat, 254);
    t.equal(result.bri, 254);
    t.equal(result.effect, 'none');
    t.end();
});

test('mapToActionObject maps colorTemp requests correctly', t => {
    const testState = {
        on: true,
        colorTemp: 5800
    };
    const result = mapToActionObject(testState);

    t.true(result.on);
    t.equal(result.ct, 172);
    t.equal(result.effect, 'none');
    t.end();
});

test('mapToActionObject maps colorloop requests correctly', t => {
    const testState = {
        on: true,
        colorloop: true
    };
    const result = mapToActionObject(testState);

    t.true(result.on);
    t.equal(result.effect, 'colorloop');
    t.end();
});

test('mapToActionObject maps color without on requests correctly', t => {
    const testState = { color: '#00ffff' };
    const result = mapToActionObject(testState);

    t.true(result.on === undefined);
    t.equal(result.hue, 32768);
    t.equal(result.sat, 254);
    t.equal(result.bri, 254);
    t.equal(result.effect, 'none');
    t.end();
});

test('mapToActionObject maps colorTemp without on requests correctly', t => {
    const testState = { colorTemp: 5800 };
    const result = mapToActionObject(testState);

    t.true(result.on === undefined);
    t.equal(result.ct, 172);
    t.equal(result.effect, 'none');
    t.end();
});

test('mapToActionObject maps colorloop without on requests correctly', t => {
    const testState = { colorloop: true };
    const result = mapToActionObject(testState);

    t.true(result.on === undefined);
    t.equal(result.effect, 'colorloop');
    t.end();
});

test('mapToStateObject does the same stuff as mapToActionObject', t => {
    const testState = {
        on: true,
        color: '#ffff00'
    };

    t.same(mapToActionObject(testState), mapToStateObject(testState));
    t.end();
});
