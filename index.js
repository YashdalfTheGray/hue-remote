require('dotenv').config();
require('./util/checkEnv');

const os = require('os');
const fs = require('fs');
const https = require('https');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const chalk = require('chalk');

const checkAuthToken = require('./util/checkAuthToken');
const lightsRouter = require('./endpoints/lights');

const app = express();
const apiRouter = express.Router(); // eslint-disable-line new-cap

const appPort = process.env.PORT || process.argv[2] || 8080;
const cert = {
    key: fs.readFileSync('./sslcert/key.pem'),
    cert: fs.readFileSync('./sslcert/cert.pem')
};

app.use(bodyParser.json());
app.use(morgan('common'));

if (process.argv.filter(a => a === '--letsencrypt-verify').length > 0) {
    console.log([
        '\n' + chalk.yellow('WARNING!'),
        'The server running in Let\'s Encrypt verification mode.',
        'It is serving any files under ' + chalk.magenta('./static') + ' without any authentication.',
        'A restart without the ' + chalk.cyan('--letsencrypt-verify') + ' switch is suggested',
        'after verification is complete.\n'
    ].join(os.EOL));
    app.use(express.static('static'));
}

app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        bridge: process.env.HUE_BRIDGE_ADDRESS
    });
});

apiRouter.use(checkAuthToken);
apiRouter.use('/lights', lightsRouter);

app.use('/api', apiRouter);

https.createServer(cert, app).listen(appPort, () => console.log(`Hue remote now listening at ${chalk.green(appPort)}...`));
