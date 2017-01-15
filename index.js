require('dotenv').config();
require('./util/checkEnv');

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https');

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
app.use(checkAuthToken);

app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        bridge: process.env.HUE_BRIDGE_ADDRESS
    });
});

apiRouter.use('/lights', lightsRouter);

app.use('/api', apiRouter);

https.createServer(cert, app).listen(appPort, () => console.log(`Hue remote now listening at ${appPort}...`));
