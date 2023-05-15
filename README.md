# Tink API Unofficial JavaScript API

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/pyrexfm)

The documentation for the Tink API is available here [here](https://api.ynab.com). Not all endpoints are available but feel free to contribute!

## Installation

First, install the module with npm (or yarn):

```shell
npm install tink-sdk
```

Then, depending upon your usage context, add a reference to it:

### CommonJS / Node

```typescript
const tink = require("tink-sdk");
```

### ESM / TypeScript

```typescript
import TinkClient from "tink-sdk";
```

## Usage

To use this client you must have a Client ID and Client Secret from [Tink console](https://console.tink.com/app-settings/client).

```typescript
import TinkClient from "tink-sdk";

const tink = new TinkClient({
  clientId: process.env.TINK_CLIENT_ID,
  clientSecret: process.env.TINK_CLIENT_SECRET,
});

const user = await tink.user.createUser({
  externalUserId: "test-user",
  market: "GB",
  locale: "en_US",
});
```

You don't need to generate an access token for each operation as the SDK handles that for you, including requesting new ones when they expire.

### Error Handling

If a response is returned with a code >= 300, instead of returning the response,
the response will be thrown as an error to be caught. The error has the following fields:

```typescript
{
  name: "Request failed",
  message: "Request failed with status 404: Not found",
  status: 404,
  statusText: "Not found",
  request: {
    url: `http://tink.api.com/notfound?foo=bar`,
    options: fetchOptions,
  }
  response: "Fetch response object"
}
```
