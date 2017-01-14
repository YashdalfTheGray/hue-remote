# Utilities

The code that goes with this documentation can be found under the `util/` folder.

## `checkAuthToken`

So the way that Hue handles authentication is really terrible when opening it up to the internet. Once you register as a developer against the Hue Bridge, it gives you a username string. You then use the username string *in the URL* of the request to "authenticate". Dumb. So for example, if you want to check the status of the lights that the bridge knows about you would `GET` the endpoint `/api/<your_username>/lights`.

The reason that they use it is that the API is only exposed locally and you should know who is hanging out on your local network, I guess? Either way, super shitty authentication method. To mitigate that, I switched to using the `Authorization` header and using a different auth key to authenticate. It's a lot easier to configure `hue-remote` to use a different auth key than register a new Hue Bridge developer.

## `convert`

Another idiosyncrasy with Hue is the way that it handles color or color temperature. To turn on the light/change light color, you have to `POST` to `/api/<your_username>/lights/<light_id>/state` with a body like the examples below.

For setting a color,

```json
{
    "on": true,
    "colormode": "hs",
    "bri": "254",
    "hue": "34974",
    "sat": "178"
}
```

For setting a color temperature,

```json
{
    "on": true,
    "colormode": "ct",
    "ct": "153"
}
```

### `.rgbToHue()`

If the example `POST` bodies don't make sense, that's expected. For setting color, Hue uses a custom scaled HSL color space. It's also called HSV/HSB in some places. You can find the min and max for HSL and Hue-HSB in the table below.

|             | Hue   | Saturation | Luminosity/Value/Brightness |
|-------------|-------|------------|-----------------------------|
| HSL min     | 0     | 0          | 0                           |
| Hue-HSB min | 0     | 0          | 1                           |
| HSL max     | 360   | 100        | 100                         |
| Hue-HSB max | 65535 | 254        | 254                         |

As can be seen, the values are not intuitive but luckily are just scaled so the `convert` utility handles the scaling. it also goes a step further and handles the conversion from RGB to HSL and then HSL to Hue-HSB. So you can hand RGB colors to the API and it will tell the lights the right thing. Yay!

Use `convert.rgbToHue('#453ade')` to convert to from RGB string to Hue-HSB or `convert.rgbToHue([54, 126, 233])` to convert an RGB array to Hue-HSB. Giving no input will output an error.

### `.tempToMired`

Hue uses something called the Mired color temperature to set the color temperature of the lights. It's a reciprocal temperature number. The formula for it can be found on the Wikipedia page linked in the resources but it would be great to not have to think about that. So `convert.tempToMired(6500)` will convert a human readable color temperature to the Mired values that hue uses. Passing nothing to `convert.tempToMired()` will set the color temperature to 6500K.   
