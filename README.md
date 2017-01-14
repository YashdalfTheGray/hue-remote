# hue-remote
A Phillips Hue remote API that provides remote access to the Hue bridge.

## Setup

Clone the repository locally and then run `npm install` to install all the dependencies.

## Running

Run `npm start` to start the Hue remote server. This server depends on a few environment variables to be set. Create a copy of the file called `.env.example` and replace the dummy values with actual data. Some explanation around the environment variables is included below.

## Environment Variables

| Environment Variable  | Explanation                                                                      |
|-----------------------|----------------------------------------------------------------------------------|
| `PORT`                | The port that you want the server to use.                                        |
| `HUE_BRIDGE_ADDRESS`  | The local IP address of your hue bridge.                                         |
| `HUE_BRIDGE_USERNAME` | The username that the bridge gives you after registering with the local Hue API, |
| `HUE_REMOTE_TOKEN`    | An access token that you want to use to authenticate with the Hue remote API.    |

## Testing

You can use `npm test` to run the tests against the `checkAuthToken` middleware and the `convert` color conversion utility.

## Suggested use

This is an API server. It is intended to be started and left running on a computer with an open port. The easiest way to do that is to use the `forever` npm module. Run `npm install --global forever` to install it. `forever` is a utility that turns any node scripts into services that can run in the background. If one of those scripts encounters a fatal error and dies, it is logged and the script is restarted.

The default command is `forever start index.js`. This will start `index.js` as a service which can then be left alone for the long term. The location of the logfile for this command can be gotten using `forever logs`.

To get a little fancier, you  can use `forever start -l forever.log -o out.log -e err.log index.js`. This command separates the forever logs, the `stdout` and the `stderr` output streams. You can use `forever list` to get a list of all the running processes and `forever stop` to stop a process.

## Included utilities

Check [docs/utils.md](docs/utils.md) for documentation of some of the tools included with `hue-remote`. The Hue local API isn't very developer friendly or secure so these utilities take some steps towards both those. 

## The API

check [docs/api.md](docs/api.md) for documentation on the full Hue Remote API.

## Some resources

* [Hue Bridge API](https://www.developers.meethue.com/documentation/getting-started) - you have to set up yourself as a developer on your Hue Bridge and log into the Hue Developers website to access the documentation, blegh.
* [HSL color space](https://en.wikipedia.org/wiki/HSL_and_HSV) - this is kind of the color space that the Hue Bridge uses but scales differently for whatever reason. My sneaking suspicion is that the bridge has terrible floating point support.
* [Mired color temperature](https://en.wikipedia.org/wiki/Mired) - this is what Hue uses to set the color temperature for the lights.
