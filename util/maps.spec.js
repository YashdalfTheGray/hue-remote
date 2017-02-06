const test = require('tape');
const _ = require('lodash');

const { mapActionObject, mapStateObject } = require('./maps');
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


test('mapActionObject works in colorloop mode', t => {
    const colorLoopTestAction = _.assign({}, baseTestAction, { effect: 'colorloop' });
    const result = mapActionObject(colorLoopTestAction);

    t.equal(result.colorloop, true);
    t.equal(result.on, colorLoopTestAction.on);
    t.end();
});

test('mapActionObject works in ct mode', t => {
    const ctTestAction = _.assign({}, baseTestAction, { colormode: 'ct' });
    const result = mapActionObject(ctTestAction);

    t.equal(result.colorTemp, convert.miredToTemp(ctTestAction.ct));
    t.equal(result.on, ctTestAction.on);
    t.end();
});

test('mapActionObject works in hs mode', t => {
    const hsTestAction = _.assign({}, baseTestAction, { colormode: 'hs' });
    const result = mapActionObject(hsTestAction);

    t.equal(result.color, convert.hueToRgbString([hsTestAction.hue, hsTestAction.sat, hsTestAction.bri]));
    t.equal(result.on, hsTestAction.on);
    t.end();
});

test('mapActionObject works in xy mode', t => {
    const xyTestAction = _.assign({}, baseTestAction, { colormode: 'xy' });
    const result = mapActionObject(xyTestAction);

    t.equal(result.color, convert.hueToRgbString([xyTestAction.hue, xyTestAction.sat, xyTestAction.bri]));
    t.equal(result.on, xyTestAction.on);
    t.end();
});

test('mapActionObject acts as a passthrough when no interesting properties are found', t => {
    const passTestAction = {
        on: true,
        foo: 'bar'
    };
    const result = mapActionObject(passTestAction);

    t.equal(result.foo, passTestAction.foo);
    t.equal(result.on, passTestAction.on);
    t.end();
});

test('mapStateObject works in colorloop mode', t => {
    const colorLoopTestState = _.assign({}, baseTestState, { effect: 'colorloop' });
    const result = mapStateObject(colorLoopTestState);

    t.equal(result.colorloop, true);
    t.equal(result.on, colorLoopTestState.on);
    t.equal(result.reachable, colorLoopTestState.reachable);
    t.end();
});

test('mapStateObject works in ct mode', t => {
    const ctTestState = _.assign({}, baseTestState, { colormode: 'ct' });
    const result = mapStateObject(ctTestState);

    t.equal(result.colorTemp, convert.miredToTemp(ctTestState.ct));
    t.equal(result.on, ctTestState.on);
    t.equal(result.reachable, ctTestState.reachable);
    t.end();
});

test('mapStateObject works in hs mode', t => {
    const hsTestState = _.assign({}, baseTestState, { colormode: 'hs' });
    const result = mapStateObject(hsTestState);

    t.equal(result.color, convert.hueToRgbString([hsTestState.hue, hsTestState.sat, hsTestState.bri]));
    t.equal(result.on, hsTestState.on);
    t.equal(result.reachable, hsTestState.reachable);
    t.end();
});

test('mapStateObject works in xy mode', t => {
    const xyTestState = _.assign({}, baseTestState, { colormode: 'xy' });
    const result = mapStateObject(xyTestState);

    t.equal(result.color, convert.hueToRgbString([xyTestState.hue, xyTestState.sat, xyTestState.bri]));
    t.equal(result.on, xyTestState.on);
    t.equal(result.reachable, xyTestState.reachable);
    t.end();
});

test('mapStateObject acts as a passthrough when no interesting properties are found', t => {
    const passTestState = {
        on: true,
        foo: 'bar'
    };
    const result = mapStateObject(passTestState);

    t.equal(result.foo, passTestState.foo);
    t.equal(result.on, passTestState.on);
    t.end();
});
