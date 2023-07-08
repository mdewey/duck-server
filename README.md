# Duck Server

> Quack Quack

## What this is

This is a proof of concept of taking an OpenAPI specification and launching a mock server. Emphasis on proof of concept.

## How to use this

1. Clone this repo
2. Run `npm install`
3. Run `npm start`

The spec that the server uses is set in the `index.js` file.

## Current Features

- Reads an OpenAPI specification and creates an endpoint for each path in the spec
- uses the predefiend properties to create a response
- uses the `schema` property to create a response if present
- uses the `example` property to create a response, or a dummy value if no example is provided
- *should* work for all methods that are defined. Only tested with `GET`
- Authed should work the same as the current mocks

## Future Features

- more testing and code quality refinement
- Add command line params for
  - Spec file
  - custom handlers for data
  - custom handlers for logic
- integrate with vets ecosystem
  - running on vets-website
  - reading files from vets-api
- Add support for multiple spec files
