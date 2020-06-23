# Testing SWR

Let's test https://swr.now.sh/ and the way that `stale-while-revalidate` works, using Vercel.

## The SWR Library

The SWR library is a react hook that allows you to present stale content, and re-rendering when fresh content is available.

You provide it an asynchronous function, and it will run it at configured points, like on component mount, on focus changes, or at a regular interval using a comparison mechanism you provide. It's a handy tool, but it doesn't actually have anything to do with `stale-while-revalidate` directives in HTTP requests and responses.

## Stale while revalidate in Vercel APIs

HTTP has the `cache-control` header. It can be used in these ways:

### Cache-Control in Requests

- `max-age` Define how long cached data is valid ("fresh") for
- `min-fresh` The response should be "fresh" for at least this many more seconds
- `max-stale` Define how far past "fresh" a response can be

### Cache-Control in Responses

- `public` Allow responses to be cached by clients or servers
- `max-age` How long a response is considered "fresh"
- `must-revalidate` Indicates that a client must check that their data is up to date when stale

Responses may also provide an `age` header in the response with how old the cached data is.

### Default values in Vercel

API responses provide `Cache-Control: public max-age=0 must-revalidate` which means that responses should be considered immediately stale, and clients should make another request before using stale data. That means no caching of API responses.

Vercel's built in fetch command doesn't do anything special with `Cache-Control` - Nothing is sent unless you tell it to.

### s-maxage stale-while-revalidate

Vercel's [Caching Documentation](https://vercel.com/docs/v2/edge-network/caching#stale-while-revalidate) indicates that you can provide a `Cache-Control` header in your responses.

They recommend `Cache-Control: s-maxage=1, stale-while-revalidate`. This will cause the following to happen:

- When a request is made, Vercel will cache the response to their CDN
- For one second after, all requests will be from the cache
- After one second, the next request will respond with stale cached data
- After responding with cached data, Vercel will make another request in the background and update the CDN

With this approach, slow-to-fetch endpoints are always fast. The only time a user would wait more than a few milliseconds for a response is right after a deployment.

## This Repository

This repository sets `s-maxage` in API responses, with different max ages. You can refresh the page and see that requests to a Vercel deployment are fast, but during local development responses always take at least one second. To handle that delay while looking fast, the `SWR` library's React hook is used to present a placeholder and replace it when the request is done.
