const test = require('tape');
const convert = require('./convert');

test('convert.rgbToHue handles an rgb string', t => {
    t.same(convert.rgbToHue('#deadaf'), [65089, 56, 221]);
    t.end();
});

test('convert.rgbToHue handles an rgb value array', t => {
    t.same(convert.rgbToHue([34, 52, 240]), [42736, 218, 239]);
    t.end();
});

test('convert.rgbToHue handles a malformed rgb string', t => {
    t.same(convert.rgbToHue('#dead'), []);
    t.end();
});

test('convert.rgbToHue handles a malformed rgb array', t => {
    t.same(convert.rgbToHue([124, 240]), []);
    t.end();
});

test('convert.rgbToHue handles na rgb array with illegal values', t => {
    t.same(convert.rgbToHue([124, 120, 300]), []);
    t.end();
});

test('convert.rgbToHue handles no input', t => {
    t.equal(convert.rgbToHue(), -1);
    t.end();
});

test('convert.hueToRgbArray converts to rgb array properly', t => {
    const result = [[65089, 56, 221], [42736, 218, 239]].map(convert.hueToRgbArray);

    t.same(result[0], [222, 173, 175]);
    t.same(result[1], [34, 51, 240]);
    t.end();
});

test('convert.hueToRgbString converts to rgb string properly', t => {
    const result = [[65089, 56, 221], [42736, 218, 239]].map(convert.hueToRgbString);

    t.same(result[0], '#deadaf');
    t.same(result[1], '#2233f0');
    t.end();
});

test('convert.tempToMired handles valid color temperature', t => {
    t.equal(convert.tempToMired(3000), 333);
    t.end();
});

test('convert.tempToMired handles min and max temperatures', t => {
    const result = [2000, 6500].map(convert.tempToMired);

    t.equal(result[0], 500);
    t.equal(result[1], 154);
    t.end();
});

test('convert.tempToMired handles temperatures lower than min', t => {
    t.equal(convert.tempToMired(1800), 500);
    t.end();
});

test('convert.tempToMired handles temperatures higher than max', t => {
    t.equal(convert.tempToMired(7000), 153);
    t.end();
});

test('convert.tempToMired defaults to 6500K', t => {
    t.equal(convert.tempToMired(), 154);
    t.end();
});

test('convert.miredToTemp does the conversion properly', t => {
    t.equal(convert.miredToTemp(300), 3300);
    t.end();
});

test('convert.miredToTemp min and max are bounded', t => {
    const result = [150, 510].map(convert.miredToTemp);

    t.equal(result[0], 6500);
    t.equal(result[1], 2000);
    t.end();
});

test('convert.miredToTemp defaults to 6500K', t => {
    t.equal(convert.miredToTemp(), 6500);
    t.end();
});
