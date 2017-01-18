const test = require('tape');
const convert = require('./convert');

test('convert.rgbToHue handles an rgb string', t => {
    convert.rgbToHue('#deadaf').then(result => {
        t.same(result, [65089, 908, 906]);
        t.end();
    });
});

test('convert.rgbToHue handles an rgb value array', t => {
    convert.rgbToHue([34, 52, 240]).then(result => {
        t.same(result, [42736, 596, 595]);
        t.end();
    });
});

test('convert.rgbToHue handles a malformed rgb string', t => {
    convert.rgbToHue('#dead').catch(() => {
        t.assert(true, 'The promise was not rejected as was expected');
        t.end();
    });
});

test('convert.rgbToHue handles a malformed rgb array', t => {
    convert.rgbToHue([124, 120]).catch(() => {
        t.assert(true, 'The promise was not rejected as was expected');
        t.end();
    });
});

test('convert.rgbToHue handles na rgb array with illegal values', t => {
    convert.rgbToHue([124, 120, 300]).catch(() => {
        t.assert(true, 'The promise was not rejected as was expected');
        t.end();
    });
});

test('convert.rgbToHue handles no input', t => {
    convert.rgbToHue().catch(() => {
        t.assert(true, 'The promise was not rejected as was expected');
        t.end();
    });
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
