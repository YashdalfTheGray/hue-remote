require('dotenv').config();
require('./util/checkEnv');

const os = require('os');
const fs = require('fs');
const https = require('https');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const helmet = require('helmet');

const { checkAuthToken, setupRedis, injectRedis } = require('./util');
const { getLightsRoot, getLightsId, postLightsIdState } = require('./endpoints/lights');
const { getGroupsRoot, getGroupsId, postGroupIdAction } = require('./endpoints/groups');
const { getScenes, getOneScene, deleteOneScene, runScene } = require('./endpoints/scenes');
const { getProtocols, getOneProtocol, createProtocol, deleteProtocol, updateProtocol, runProtocol } = require('./endpoints/protocols');

const wrap = fn => (...args) => fn(...args).catch(args[2]);

if (process.argv.filter(a => a === '--letsencrypt-verify').length > 0) {
    const httpApp = express();
    httpApp.use(morgan('dev'));

    console.log([
        `\n${chalk.yellow('WARNING!')}`,
        'The server running in Let\'s Encrypt verification mode.',
        `It is serving any files under ${chalk.magenta('./static')} without any authentication over HTTP.`,
        `A restart without the ${chalk.cyan('--letsencrypt-verify')} switch is suggested`,
        'after verification is complete.\n'
    ].join(os.EOL));

    httpApp.get('/', (req, res) => res.json({ foo: 'bar' }));

    httpApp.use(express.static('static'));
    httpApp.listen(8080, () => console.log(`Let's Encrypt verify server running at ${chalk.green('8080')}...`));
}
else {
    const app = express();
    const apiRouter = express.Router(); // eslint-disable-line new-cap
    const client = setupRedis(process.env.REDIS_URL);

    const appPort = process.env.PORT || process.argv[2] || 8080;
    const cert = {
        key: fs.readFileSync('./sslcert/key.pem'),
        cert: fs.readFileSync('./sslcert/cert.pem')
    };

    app.use(bodyParser.json());
    app.use(morgan('common'));
    app.use(helmet());

    app.get('/', (req, res) => {
        res.json({
            status: 'ok',
            bridgeFound: !!process.env.HUE_BRIDGE_ADDRESS,
            bridgeUserFound: !!process.env.HUE_BRIDGE_USERNAME,
            apiTokenFound: !!process.env.HUE_REMOTE_TOKEN
        });
    });

    apiRouter.use(checkAuthToken);

    apiRouter.get('/lights', getLightsRoot);
    apiRouter.get('/lights/:id', getLightsId);
    apiRouter.post('/lights/:id/state', postLightsIdState);

    apiRouter.get('/groups', getGroupsRoot);
    apiRouter.get('/groups/:id', getGroupsId);
    apiRouter.post('/groups/:id/action', postGroupIdAction);

    apiRouter.get('/scenes', wrap(getScenes));
    apiRouter.get('/scenes/:id', wrap(getOneScene));
    apiRouter.delete('/scenes/:id', wrap(deleteOneScene));
    apiRouter.post('/scenes/:id', wrap(runScene));

    apiRouter.get('/protocols', injectRedis(client), wrap(getProtocols));
    apiRouter.post('/protocols', injectRedis(client), wrap(createProtocol));
    apiRouter.get('/protocols/:name', injectRedis(client), wrap(getOneProtocol));
    apiRouter.delete('/protocols/:name', injectRedis(client), wrap(deleteProtocol));
    apiRouter.put('/protocols/:name', injectRedis(client), wrap(updateProtocol));
    apiRouter.post('/protocols/:name', injectRedis(client), wrap(runProtocol));

    app.use('/api', apiRouter);

    https.createServer(cert, app).listen(appPort, () => console.log(`Hue remote now listening at ${chalk.green(appPort)}...`));
}
