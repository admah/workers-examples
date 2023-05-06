# basic-worker

A simple example of using a Worker to return an environment variable named ENVIRONMENT.

## Instructions

1. Run `npm i` to install dependencies.
2. Run `npm run start` or `wrangler dev` and visit `http://127.0.0.1:8787/` to see the ENVIRONMENT var from `dev.vars`
3. Run `npm run deploy` or `wrangler publish`. Once deployed, visit the url to see the ENVIRONMENT var set from `wrangler.toml`.
