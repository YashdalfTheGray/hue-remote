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
});
