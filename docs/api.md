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
