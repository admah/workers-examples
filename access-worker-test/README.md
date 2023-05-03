# Access Worker

An example of how a Worker can validate and interact with Cloudflare Access JWT.

This is a rewrite of the Cloudflare Access Pages Plugin found [here](https://developers.cloudflare.com/pages/platform/functions/plugins/cloudflare-access/).

## Instructions

This worker contains four functions for demo purposes:

1. Get more information about a given user’s identity
2. Generate a login URL and redirect the user
3. Generate a logout URL
4. Validate the user and redirect or return a 403
