const test = require('tape');
const convert = require('./convert');

test('convertColor handles an rgb string', t => {
    const result = convert.rgbToHue('#deadaf');

    t.equal(result.status, 'ok');
    t.end();
});

test('convertColor handles an rgb value array', t => {
    const result = convert.rgbToHue([34, 52, 240]);

    t.equal(result.status, 'ok');
    t.end();
});

test('convertColor handles a malformed rgb string', t => {
    const result = convert.rgbToHue('#dead');

    t.equal(result.status, 'error');
    t.end();
});

test('convertColor handles a malformed rgb array', t => {
    const result = convert.rgbToHue([124, 120]);

    t.equal(result.status, 'error');
    t.end();
});

test('convertColor handles na rgb array with illegal values', t => {
    const result = convert.rgbToHue([124, 120, 300]);

    t.equal(result.status, 'error');
    t.end();
});

test('convertColor handles no input', t => {
    const result = convert.rgbToHue();

    t.equal(result.status, 'error');
    t.end();
});
