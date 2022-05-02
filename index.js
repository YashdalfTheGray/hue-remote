import 'dotenv/config';
import './util/checkEnv';

import os from 'os';
import fs from 'fs';
import https from 'https';

import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import chalk from 'chalk';
import helmet from 'helmet';
import rfs from 'rotating-file-stream';

import {
  checkAuthToken,
  setupRedis,
  injectRedis,
  getLogsPath,
  logger,
  getAppStatus
} from './util';
import {
  getLightsRootAsync,
  getLightsIdAsync,
  postLightsIdStateAsync
} from './endpoints/lights';
import {
  getGroupsRootAsync,
  getGroupsIdAsync,
  postGroupIdActionAsync
} from './endpoints/groups';
import {
  getScenesAsync,
  getOneSceneAsync,
  deleteOneSceneAsync,
  runSceneAsync
} from './endpoints/scenes';
import {
  getProtocols,
  getOneProtocol,
  createProtocol,
  deleteProtocol,
  updateProtocol,
  runProtocolAsync
} from './endpoints/protocols';

const wrap =
  fn =>
  (...args) =>
    fn(...args).catch(args[2]);

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
  (async () => {
    const app = express();
    app.locals.logger = logger;
    const apiRouter = express.Router(); // eslint-disable-line new-cap
    const apiv2Router = express.Router(); // eslint-disable-line new-cap

    const client = setupRedis(process.env.REDIS_URL);
    await client.connect();
    process.on('exit', () => client.quit());

    const requestLogStream = rfs.createStream('request.log', {
      interval: '6h',
      path: getLogsPath(),
      size: '10M',
      compress: 'gzip'
    });

    const appPort = process.env.PORT || process.argv[2] || 8080;
    const cert = {
      key: fs.readFileSync('./sslcert/key.pem'),
      cert: fs.readFileSync('./sslcert/cert.pem')
    };
    logger.info('Read TLS cert');

    const appStatus = getAppStatus(process.env);
    logger.info(JSON.stringify(appStatus));

    app.use(bodyParser.json());
    app.use(morgan('common'));
    app.use(morgan('common', { stream: requestLogStream }));
    app.use(helmet());
    logger.info('Set up request logging');

    app.get('/', (req, res) => {
      res.json(appStatus);
    });

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
        logger.info(`Hue remote now listening at ${chalk.green(appPort)}...`)
      );
  })();
}
