const test = require('ava');
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

    t.is(result.colorloop, true);
    t.is(result.on, colorLoopTestAction.on);
});

test('mapFromActionObject works in ct mode', t => {
    const ctTestAction = _.assign({}, baseTestAction, { colormode: 'ct' });
    const result = mapFromActionObject(ctTestAction);

    t.is(result.colorTemp, convert.miredToTemp(ctTestAction.ct));
    t.is(result.on, ctTestAction.on);
});

test('mapFromActionObject works in hs mode', t => {
    const hsTestAction = _.assign({}, baseTestAction, { colormode: 'hs' });
    const result = mapFromActionObject(hsTestAction);

    t.is(result.color, convert.hueToRgbString([hsTestAction.hue, hsTestAction.sat, hsTestAction.bri]));
    t.is(result.on, hsTestAction.on);
});

test('mapFromActionObject works in xy mode', t => {
    const xyTestAction = _.assign({}, baseTestAction, { colormode: 'xy' });
    const result = mapFromActionObject(xyTestAction);

    t.is(result.color, convert.hueToRgbString([xyTestAction.hue, xyTestAction.sat, xyTestAction.bri]));
    t.is(result.on, xyTestAction.on);
});

test('mapFromActionObject acts as a passthrough when no interesting properties are found', t => {
    const passTestAction = {
        on: true,
        foo: 'bar'
    };
    const result = mapFromActionObject(passTestAction);

    t.is(result.foo, passTestAction.foo);
    t.is(result.on, passTestAction.on);
});

test('mapFromStateObject works in colorloop mode', t => {
    const colorLoopTestState = _.assign({}, baseTestState, { effect: 'colorloop' });
    const result = mapFromStateObject(colorLoopTestState);

    t.is(result.colorloop, true);
    t.is(result.on, colorLoopTestState.on);
    t.is(result.reachable, colorLoopTestState.reachable);
});

test('mapFromStateObject works in ct mode', t => {
    const ctTestState = _.assign({}, baseTestState, { colormode: 'ct' });
    const result = mapFromStateObject(ctTestState);

    t.is(result.colorTemp, convert.miredToTemp(ctTestState.ct));
    t.is(result.on, ctTestState.on);
    t.is(result.reachable, ctTestState.reachable);
});

test('mapFromStateObject works in hs mode', t => {
    const hsTestState = _.assign({}, baseTestState, { colormode: 'hs' });
    const result = mapFromStateObject(hsTestState);

    t.is(result.color, convert.hueToRgbString([hsTestState.hue, hsTestState.sat, hsTestState.bri]));
    t.is(result.on, hsTestState.on);
    t.is(result.reachable, hsTestState.reachable);
});

test('mapFromStateObject works in xy mode', t => {
    const xyTestState = _.assign({}, baseTestState, { colormode: 'xy' });
    const result = mapFromStateObject(xyTestState);

    t.is(result.color, convert.hueToRgbString([xyTestState.hue, xyTestState.sat, xyTestState.bri]));
    t.is(result.on, xyTestState.on);
    t.is(result.reachable, xyTestState.reachable);
});

test('mapFromStateObject acts as a passthrough when no interesting properties are found', t => {
    const passTestState = {
        on: true,
        foo: 'bar'
    };
    const result = mapFromStateObject(passTestState);

    t.is(result.foo, passTestState.foo);
    t.is(result.on, passTestState.on);
});

test('mapToActionObject maps off requests correctly', t => {
    t.false(mapToActionObject({ on: false }).on);
    t.pass(mapToActionObject({}).on === undefined);
});

test('mapToActionObject maps on requests correctly', t => {
    t.true(mapToActionObject({ on: true }).on);
});

test('mapToActionObject maps color requests correctly', t => {
    const testState = {
        on: true,
        color: '#00ff00'
    };
    const result = mapToActionObject(testState);

    t.true(result.on);
    t.is(result.hue, 21845);
    t.is(result.sat, 254);
    t.is(result.bri, 254);
    t.is(result.effect, 'none');
});

test('mapToActionObject maps colorTemp requests correctly', t => {
    const testState = {
        on: true,
        colorTemp: 5800
    };
    const result = mapToActionObject(testState);

    t.true(result.on);
    t.is(result.ct, 172);
    t.is(result.effect, 'none');
});

test('mapToActionObject maps colorloop requests correctly', t => {
    const testState = {
        on: true,
        colorloop: true
    };
    const result = mapToActionObject(testState);

    t.true(result.on);
    t.is(result.effect, 'colorloop');
});

test('mapToActionObject maps color without on requests correctly', t => {
    const testState = { color: '#00ffff' };
    const result = mapToActionObject(testState);

    t.true(result.on === undefined);
    t.is(result.hue, 32768);
    t.is(result.sat, 254);
    t.is(result.bri, 254);
    t.is(result.effect, 'none');
});

test('mapToActionObject maps colorTemp without on requests correctly', t => {
    const testState = { colorTemp: 5800 };
    const result = mapToActionObject(testState);

    t.true(result.on === undefined);
    t.is(result.ct, 172);
    t.is(result.effect, 'none');
});

test('mapToActionObject maps colorloop without on requests correctly', t => {
    const testState = { colorloop: true };
    const result = mapToActionObject(testState);

    t.true(result.on === undefined);
    t.is(result.effect, 'colorloop');
});

test('mapToStateObject does the same stuff as mapToActionObject', t => {
    const testState = {
        on: true,
        color: '#ffff00'
    };

    t.deepEqual(mapToActionObject(testState), mapToStateObject(testState));
});
