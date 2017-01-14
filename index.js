require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const checkAuthToken = require('./util/checkAuthToken');
const lightsRouter = require('./endpoints/lights');

const app = express();
const apiRouter = express.Router(); // eslint-disable-line new-cap

const appPort = process.env.PORT || process.argv[2] || 8080;

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

app.listen(appPort, () => console.log(`Hue remote now listening at ${appPort}...`));
