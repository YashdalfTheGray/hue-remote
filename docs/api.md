# The API

## Authentication

All the endpoints require the `Authorization` header to be set. This API uses a bearer token to authenticate users. The bearer token can be set using the `.env` file.

## `GET /api/lights`

Gets the status of all the lights known by the bridge. This works essentially as a proxy for `/api/<username>/lights` endpoint on the Hue Local API.

## `GET /api/lights/<light_id>`

Similar to the `/api/lights` endpoint, this works as a proxy for `/api/<username>/lights/<id>` endpoint on the Hue Local API.

## `GET /api/lights/<light_id>/state`

This is where things get more interesting. You cannot `GET` this endpoint on the Hue Local API, you can only `POST` to it. For now, this just returns the `state` object from the call above but this is intended to work the same way as `POST`ing to this endpoint. It will convert colors and map properties to behave similar to the `POST` endpoint.

## `POST /api/lights/<light_id>/state`

This affects the state of the lights. It takes a JSON object as the body with some properties, converts the colors through the `convert` utility and then passes it on to `/api/<username>/lights/<id>/state`. The only difference is that this endpoint is a `POST` while the aforementioned Hue local API endpoint is a `PUT`.

The acceptable properties are listed below.

| Key         | Type                | Description                                                                 |
|-------------|---------------------|-----------------------------------------------------------------------------|
| `on`        | `bool`              | This turns the light on if set to `true` and off if set to `false`.         |
| `color`     | `string` or `array` | This is the color that you want to set the light to.                        |
| `colorTemp` | `number`            | This is the color temperature that you want to set the light to.            |
| `colorloop` | `bool`              | Setting this to true will start the light looping through the RGB spectrum. |

**Some Notes**

* You cannot change set the other properties on the light if `on` is set to `false`. The local API will return a `200` but an error along with it.
* On a related note, the local API will mostly always return `200` unless you can't access an endpoint. What helps is to look at the `error` property of the returned JSON to see if anything failed. 
* The `color` property is type checked and validated before being sent to the local API.
* The `color` property can accept the standard RGB string that starts with a `'#'` (eg. `'#deadaf'`) or an array of length 3 with numbers between 0 and 255 (eg. `[0, 255, 0]`).
* The `colorTemp` property follows the color temperature scale commonly found on bulbs. The limits are 2000K to 6500K. To set the light to 5000K, use `5000`.
* The `colorTemp` property is also checked for bounds, if an illegal value is encountered, it will change to the nearest legal value. For example, setting `colorTemp` to `1700` will actually send the equivalent of 2000K on to the local API.
* The lights can only loop through the color spectrum that they support. Different lights support different color spectrums and that information can be found in the Hue Developer documentation (login required, but free).
* Hue lights are stateful so if you send `{ color: '#103fad', colorloop: true }`, the light will start looping through the colors it can support but also set its color to `'#103fad'` so when you turn off the colorloop effect, it will show that color.
* The `colorloop` property overrides all the properties listed followed by `color` overriding `colorTemp`.
