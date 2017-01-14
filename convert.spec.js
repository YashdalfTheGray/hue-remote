const test = require('tape');
const convert = require('./convert');

test('convert.rgbToHue handles an rgb string', t => {
    const result = convert.rgbToHue('#deadaf');

    t.equal(result.status, 'ok');
    t.end();
});

test('convert.rgbToHue handles an rgb value array', t => {
    const result = convert.rgbToHue([34, 52, 240]);

    t.equal(result.status, 'ok');
    t.end();
});

test('convert.rgbToHue handles a malformed rgb string', t => {
    const result = convert.rgbToHue('#dead');

    t.equal(result.status, 'error');
    t.end();
});

test('convert.rgbToHue handles a malformed rgb array', t => {
    const result = convert.rgbToHue([124, 120]);

    t.equal(result.status, 'error');
    t.end();
});

test('convert.rgbToHue handles na rgb array with illegal values', t => {
    const result = convert.rgbToHue([124, 120, 300]);

    t.equal(result.status, 'error');
    t.end();
});

test('convert.rgbToHue handles no input', t => {
    const result = convert.rgbToHue();

    t.equal(result.status, 'error');
    t.end();
});

test('convert.tempToMired handles valid color temperature', t => {
    const result = convert.tempToMired(3000);

    t.equal(result, 333);
    t.end();
});

test('convert.tempToMired handles min and max temperatures', t => {
    const minResult = convert.tempToMired(2000);
    const maxResult = convert.tempToMired(6500);

    t.equal(minResult, 500);
    t.equal(maxResult, 154);
    t.end();
});

test('convert.tempToMired handles temperatures lower than min', t => {
    const result = convert.tempToMired(1800);

    t.equal(result, 500);
    t.end();
});

test('convert.tempToMired handles temperatures higher than max', t => {
    const result = convert.tempToMired(7000);

    t.equal(result, 153);
    t.end();
});

test('convert.tempToMired defaults to 6500K', t => {
    const result = convert.tempToMired();

    t.equal(result, 154);
    t.end();
});
