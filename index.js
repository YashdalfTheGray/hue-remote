require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const checkAuthToken = require('./checkAuthToken');

const app = express();

const appPort = process.env.PORT || process.argv[2] || 8080;

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(checkAuthToken);

app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        bridge: process.env.HUE_BRIDGE_ADDRESS
    });
});

app.listen(appPort, () => console.log(`Hue remote now listening at ${appPort}...`));
