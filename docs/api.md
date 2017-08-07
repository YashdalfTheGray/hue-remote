# The API

## Authentication

All the endpoints require the `Authorization` header to be set. There is a special exception for `POST` requests where the access token can be included in the request body instead. This API uses a bearer token to authenticate users. The bearer token can be set using the `.env` file. Below are the two examples showing how to authenticate.

Using the `Authorization` header for the access token:
```shell
curl -H 'Authorization: Bearer <acces_token>' https://<hue_remote_url>/api/lights
```

Using the request body for a `POST` request
```shell
curl -X POST -H 'Content-Type: application/json' -d '{ "accessToken": "<access_token>" }' https://<hue_remote_url>/api/protocols/theme
```

## Lights

Use these endpoints to interact with individual lights.

### `GET /api/lights`

Gets the status of all the lights known by the bridge. This works essentially as a proxy for `/api/<username>/lights` endpoint on the Hue local API with the addition that it maps the state object to a more readable one.

### `GET /api/lights/<light_id>`

Similar to the `/api/lights` endpoint, this works as a proxy for `/api/<username>/lights/<id>` endpoint on the Hue local API with state object mapping.

### `POST /api/lights/<light_id>/state`

This affects the state of the lights. It takes a JSON object as the body with some properties, converts the colors through the `convert` utility and then passes it on to `/api/<username>/lights/<id>/state`. The only difference is that this endpoint is a `POST` while the aforementioned Hue local API endpoint is a `PUT`.

The acceptable properties are listed below.

| Key         | Type                | Description                                                                 |
|-------------|---------------------|-----------------------------------------------------------------------------|
| `on`        | `bool`              | This turns the light on if set to `true` and off if set to `false`.         |
| `color`     | `string` or `array` | This is the color that you want to set the light to.                        |
| `colorTemp` | `number`            | This is the color temperature that you want to set the light to.            |
| `colorloop` | `bool`              | Setting this to true will start the light looping through the RGB spectrum. |

**Some Notes**

* You cannot change the other properties on the light if `on` is set to `false`. The local API will return a `200` but an error along with it.
* On a related note, the local API will mostly always return `200` unless you can't access an endpoint. What helps is to look at the `error` property of the returned JSON to see if anything failed.
* The `color` property is type checked and validated before being sent to the local API.
* The `color` property can accept a standard RGB string starting with a `'#'` (eg. `'#deadaf'`) or an array of length 3 with numbers between 0 and 255 (eg. `[0, 255, 0]`).
* The `colorTemp` property follows the color temperature scale commonly found on bulbs. The limits are 2000K to 6500K. To set the light to 5000K, use `5000`.
* The `colorTemp` property is also checked for bounds, if an illegal value is encountered, it will change to the nearest legal value. For example, setting `colorTemp` to `1700` will actually send the equivalent of 2000K on to the local API.
* The lights can only loop through the color spectrum that they support. Different lights support different color spectrums and that information can be found in the Hue Developer documentation (login required, but free).
* Hue lights are stateful so if you send `{ color: '#103fad', colorloop: true }`, the light will start looping through the colors it can support but also set its color to `'#103fad'` so when you turn off the colorloop effect, it will show that color.
* The `colorloop` property overrides all the properties listed followed by `color` overriding `colorTemp`.

## Groups

Use these endpoints to interact with groups of lights, what Hue app might call rooms.

### `GET /api/groups`

Gets the id and some information for all of the rooms or groups configured on the bridge.

### `GET /api/groups/<group_id>`

Gets more information on a single group and also converts the action object to be more readable.

### `POST /api/groups/<group_id>/action`

Takes an action on the entire group described by a JSON object. The JSON object is similar to the one accepted by the `POST /api/lights/<light_id>/state` API endpoint.

## Protocols

Protocols is a new feature that this API adds to Hue. A protocol can be used to set all the lights (across rooms or groups) to a theme or a preset. You can use these APIs to perform CRUD operations on protocols as well as run them.

### `GET /api/protocols`

Gets the names of all the stored protocols.

### `POST /api/protocols`

Stores a new protocol to the list that is described by a JSON object. The JSON object format is defined below.

```json
{
    "name": "test-protocol",
    "details": {
        "1": "#deadaf",
        "2": "#345667",
        "3": "#987654"
    }
}
```

As can be seen, the object just defines a name and an object that specifies color preset for each light by ID.

###  `GET /api/protocols/<protocol_name>`

Returns the presets for each light configured for the given protocol name.

### `DELETE /api/protocols/<protocol_name>`

Deletes the given protocol from the list of protocols.

### `PUT /api/protocols/<protocol_name>`

Updates the protocol of the given name. This is a replace operation and the new value for the protocol is defined by a JSON object containing key-value pairs where the keys are light ids and the values are the new colors to be set.

### `POST /api/protocols/<protocol_name>`

This command runs the specified protocol. This operation will happen sequentially, changing the lights one by one, starting at the first light id encountered in the object.
