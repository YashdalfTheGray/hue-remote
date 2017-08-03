const test = require('ava');
const convert = require('./convert');

test('convert.rgbToHue handles an rgb string', (t) => {
    t.deepEqual(convert.rgbToHue('#deadaf'), [65089, 56, 221]);
});

test('convert.rgbToHue handles an rgb value array', (t) => {
    t.deepEqual(convert.rgbToHue([34, 52, 240]), [42736, 218, 239]);
});

test('convert.rgbToHue handles a malformed rgb string', (t) => {
    t.deepEqual(convert.rgbToHue('#dead'), []);
});

test('convert.rgbToHue handles a malformed rgb array', (t) => {
    t.deepEqual(convert.rgbToHue([124, 240]), []);
});

test('convert.rgbToHue handles na rgb array with illegal values', (t) => {
    t.deepEqual(convert.rgbToHue([124, 120, 300]), []);
});

test('convert.rgbToHue handles no input', (t) => {
    t.is(convert.rgbToHue(), -1);
});

test('convert.hueToRgbArray converts to rgb array properly', (t) => {
    const result = [[65089, 56, 221], [42736, 218, 239]].map(convert.hueToRgbArray);

    t.deepEqual(result[0], [222, 173, 175]);
    t.deepEqual(result[1], [34, 51, 240]);
});

test('convert.hueToRgbString converts to rgb string properly', (t) => {
    const result = [[65089, 56, 221], [42736, 218, 239]].map(convert.hueToRgbString);

    t.is(result[0], '#deadaf');
    t.is(result[1], '#2233f0');
});

test('convert.hueToRgbString converts to rgb string properly with zeroes', (t) => {
    const result = [[24886, 254, 254], [21845, 254, 254]].map(convert.hueToRgbString);

    t.is(result[0], '#00ff48');
    t.is(result[1], '#00ff00');
});

test('convert.tempToMired handles valid color temperature', (t) => {
    t.is(convert.tempToMired(3000), 333);
});

test('convert.tempToMired handles min and max temperatures', (t) => {
    const result = [2000, 6500].map(convert.tempToMired);

    t.is(result[0], 500);
    t.is(result[1], 154);
});

test('convert.tempToMired handles temperatures lower than min', (t) => {
    t.is(convert.tempToMired(1800), 500);
});

test('convert.tempToMired handles temperatures higher than max', (t) => {
    t.is(convert.tempToMired(7000), 153);
});

test('convert.tempToMired defaults to 6500K', (t) => {
    t.is(convert.tempToMired(), 154);
});

test('convert.miredToTemp does the conversion properly', (t) => {
    t.is(convert.miredToTemp(300), 3300);
});

test('convert.miredToTemp min and max are bounded', (t) => {
    const result = [150, 510].map(convert.miredToTemp);

    t.is(result[0], 6500);
    t.is(result[1], 2000);
});

test('convert.miredToTemp defaults to 6500K', (t) => {
    t.is(convert.miredToTemp(), 6500);
});
