# API Hello World service

This service implements the Hello World example of Forus.io sprint 9, and will soon implement the Kindpakket functionality. 

## Running this image on docker

Building: `docker build --rm -f api\Dockerfile -t ethereum-api:latest api`

Running: `docker run --name <NAME> --rm -p <PORT>:3000 -d ethereum-api` (e.g. `docker run --name ethereum-api --rm -p 3000:3000 -d ethereum-api`)

## Usage

This PoC uses a HTTP connection to interact.

### `message/get` (GET)

Get the current message

Expected results: JSON response with `"name"` and `"message"` values

### `message/set` (POST)

Set the message. Requires a JSON body with `"name"` string and `"message"` string.

Expected results: JSON result with `"success"` with a value of `true` or `false` and an optional `"message"` response with human-readable response.