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
const rfs = require('rotating-file-stream');

const {
  checkAuthToken,
  setupRedis,
  injectRedis,
  getRequestLogsPath
} = require('./util');
const {
  getLightsRootAsync,
  getLightsIdAsync,
  postLightsIdStateAsync
} = require('./endpoints/lights');
const {
  getGroupsRootAsync,
  getGroupsIdAsync,
  postGroupIdActionAsync
} = require('./endpoints/groups');
const {
  getScenesAsync,
  getOneSceneAsync,
  deleteOneSceneAsync,
  runSceneAsync
} = require('./endpoints/scenes');
const {
  getProtocols,
  getOneProtocol,
  createProtocol,
  deleteProtocol,
  updateProtocol,
  runProtocol,
  runProtocolAsync
} = require('./endpoints/protocols');

const wrap = fn => (...args) => fn(...args).catch(args[2]);

if (process.argv.filter(a => a === '--letsencrypt-verify').length > 0) {
  const httpApp = express();
  httpApp.use(morgan('dev'));

  console.log(
    [
      `\n${chalk.yellow('WARNING!')}`,
      "The server running in Let's Encrypt verification mode.",
      `It is serving any files under ${chalk.magenta(
        './static'
      )} without any authentication over HTTP.`,
      `A restart without the ${chalk.cyan(
        '--letsencrypt-verify'
      )} switch is suggested`,
      'after verification is complete.\n'
    ].join(os.EOL)
  );

  httpApp.get('/', (req, res) => res.json({ foo: 'bar' }));

  httpApp.use(express.static('static'));
  httpApp.listen(8080, () =>
    console.log(
      `Let's Encrypt verify server running at ${chalk.green('8080')}...`
    )
  );
} else {
  const app = express();
  const apiRouter = express.Router(); // eslint-disable-line new-cap
  const apiv2Router = express.Router(); // eslint-disable-line new-cap
  const client = setupRedis(process.env.REDIS_URL);

  const requestLogStream = rfs.createStream('request.log', {
    interval: '6h',
    path: getRequestLogsPath(),
    size: '10M',
    compress: 'gzip'
  });

  const appPort = process.env.PORT || process.argv[2] || 8080;
  const cert = {
    key: fs.readFileSync('./sslcert/key.pem'),
    cert: fs.readFileSync('./sslcert/cert.pem')
  };

  app.use(bodyParser.json());
  app.use(morgan('common'));
  app.use(morgan('common', { stream: requestLogStream }));
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
  apiv2Router.use(checkAuthToken);

  apiv2Router.get('/lights', wrap(getLightsRootAsync));
  apiv2Router.get('/lights/:id', wrap(getLightsIdAsync));
  apiv2Router.post('/lights/:id/state', wrap(postLightsIdStateAsync));

  apiv2Router.get('/groups', wrap(getGroupsRootAsync));
  apiv2Router.get('/groups/:id', wrap(getGroupsIdAsync));
  apiv2Router.post('/groups/:id/action', wrap(postGroupIdActionAsync));

  apiv2Router.get('/scenes', wrap(getScenesAsync));
  apiv2Router.get('/scenes/:id', wrap(getOneSceneAsync));
  apiv2Router.delete('/scenes/:id', wrap(deleteOneSceneAsync));
  apiv2Router.post('/scenes/:id', wrap(runSceneAsync));

  apiRouter.post('/protocols/:name', injectRedis(client), wrap(runProtocol));
  apiv2Router.get('/protocols', injectRedis(client), wrap(getProtocols));
  apiv2Router.post('/protocols', injectRedis(client), wrap(createProtocol));
  apiv2Router.get(
    '/protocols/:name',
    injectRedis(client),
    wrap(getOneProtocol)
  );
  apiv2Router.delete(
    '/protocols/:name',
    injectRedis(client),
    wrap(deleteProtocol)
  );
  apiv2Router.put(
    '/protocols/:name',
    injectRedis(client),
    wrap(updateProtocol)
  );
  apiv2Router.post(
    '/protocols/:name',
    injectRedis(client),
    wrap(runProtocolAsync)
  );

  app.use('/api', apiRouter);
  app.use('/api/v2', apiv2Router);

  https
    .createServer(cert, app)
    .listen(appPort, () =>
      console.log(`Hue remote now listening at ${chalk.green(appPort)}...`)
    );
}
