[![Test and lint](https://github.com/YashdalfTheGray/hue-remote/actions/workflows/test-and-lint.yml/badge.svg)](https://github.com/YashdalfTheGray/hue-remote/actions/workflows/test-and-lint.yml)
[![Docker Image Build](https://github.com/YashdalfTheGray/hue-remote/actions/workflows/docker-build.yml/badge.svg)](https://github.com/YashdalfTheGray/hue-remote/actions/workflows/docker-build.yml)

# hue-remote

A Phillips Hue remote API that provides access to the Hue bridge from outside the local network. This project only supports Node.js v14 or higher since it is using ECMAScript Modules support within Node.js.

## Setup

Clone the repository locally and check out the [Docker Compose installation](https://docs.docker.com/compose/install/) page to get all the tools necessary.

## Running

Run `docker-compose up` to start the Hue remote server. This server depends on a few environment variables to be set. Create a copy of the file called `.env.example` and replace the dummy values with actual data. Some explanation around the environment variables is included below.

**Note** - This server won't start unless there is a valid `cert.pem` and `key.pem` in under `sslcert`.

The server can also run in Let's Encrypt verify mode by passing in the `--letsencrypt-verify` command line switch. It will start an HTTP server on port 8080. Check [docs/ssl.md](docs/ssl.md) for more information.

## Environment Variables

| Environment Variable  | Explanation                                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `PORT`                | The port that you want the HTTPS server to use, defaults to 8080.                                                         |
| `HUE_BRIDGE_ADDRESS`  | The local IP address of your hue bridge.                                                                                  |
| `HUE_BRIDGE_USERNAME` | The username that the bridge gives you after registering with the local Hue API,                                          |
| `HUE_REMOTE_TOKEN`    | An access token that you want to use to authenticate with the Hue remote API.                                             |
| `REDIS_URL`           | The URL of the Redis server to store the protocols.                                                                       |
| `LOGS_OUTPUT_PATH`    | A path where the logs should be stored, defaults to `./output/logs`. This option supports absolute paths like `/tmp/logs` |

## Testing

You can use `npm test` to run the tests against all the utility files included with this project. Sanity check - they should all pass on a newly cloned repository.

## The API

check [docs/api.md](docs/api.md) for documentation on the full Hue Remote API.

## Suggested use

This is an API server. It is intended to be started and left running on a computer with an open port. The easiest way to do that is to use the Docker Compose. This project comes with it's own `Dockerfile` and also a `docker-compose.yml` which defines the relationship between this app and the Redis server needed as a key value store.

Once you have Docker Compose, a simple `docker-compose up` will start the application. You'd want to run it in the background though after confirming that everything works. You can do that by running `docker-compose up -d`.

To get the logs from the server, you have to locate the docker container name first. Run `docker-compose ps` and locate the name of the app container. You can tell which one it is by looking for the container with the command `npm start`. Once found, run `docker-compose logs <container_name>`. You can also get the Redis logs in the same way.

## Included utilities

Check [docs/utils.md](docs/utils.md) for documentation of some of the tools included with `hue-remote`. The Hue local API isn't very developer friendly or secure so these utilities take some steps towards both those.

## Some resources

- [Hue Bridge API](https://www.developers.meethue.com/documentation/getting-started) - you have to set up yourself as a developer on your Hue Bridge and log into the Hue Developers website to access the documentation, blegh.
- [HSL color space](https://en.wikipedia.org/wiki/HSL_and_HSV) - this is kind of the color space that the Hue Bridge uses but scales differently for whatever reason. My sneaking suspicion is that the bridge doesn't have full floating point support.
- [Mired color temperature](https://en.wikipedia.org/wiki/Mired) - this is what Hue uses to set the color temperature for the lights.
- [`node-fetch`](https://www.npmjs.com/package/node-fetch)
