const test = require('tape');
const convert = require('./convert');

test('convertColor', t => {
    t.test('handles an rgb string', t => {
        const result = convert.rgbToHue('#deadaf');

        t.equal(result.status, 'ok');
        t.end();
    });

    t.test('handles an rgb value array', t => {
        const result = convert.rgbToHue([34, 52, 240]);

        t.equal(result.status, 'ok');
        t.end();
    });

    t.test('handles a malformed rgb string', t => {
        const result = convert.rgbToHue('#dead');

        t.equal(result.status, 'error');
        t.end();
    });

    t.test('handles a malformed rgb array', t => {
        const result = convert.rgbToHue([124, 120]);

        t.equal(result.status, 'error');
        t.end();
    });

    t.test('handles na rgb array with illegal values', t => {
        const result = convert.rgbToHue([124, 120, 300]);

        t.equal(result.status, 'error');
        t.end();
    });
});
