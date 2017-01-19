const test = require('tape');
const Promise = require('bluebird');
const convert = require('./convert');

test('convert.rgbToHue handles an rgb string', t => {
    convert.rgbToHue('#deadaf').then(result => {
        t.same(result, [65089, 56, 221]);
        t.end();
    });
});

test('convert.rgbToHue handles an rgb value array', t => {
    convert.rgbToHue([34, 52, 240]).then(result => {
        t.same(result, [42736, 218, 239]);
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
    convert.tempToMired(3000).then(result => {
        t.equal(result, 333);
        t.end();
    });
});

test('convert.tempToMired handles min and max temperatures', t => {
    Promise.all([
        convert.tempToMired(2000),
        convert.tempToMired(6500)
    ]).then(results => {
        t.equal(results[0], 500);
        t.equal(results[1], 154);
        t.end();
    });
});

test('convert.tempToMired handles temperatures lower than min', t => {
    convert.tempToMired(1800).then(result => {
        t.equal(result, 500);
        t.end();
    });
});

test('convert.tempToMired handles temperatures higher than max', t => {
    convert.tempToMired(7000).then(result => {
        t.equal(result, 153);
        t.end();
    });
});

test('convert.tempToMired defaults to 6500K', t => {
    convert.tempToMired().then(result => {
        t.equal(result, 154);
        t.end();
    });
});
