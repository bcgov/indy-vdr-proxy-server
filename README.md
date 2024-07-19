# indy-vdr-proxy-server

## Description

HTTP proxy for the Indy verifiable data registry to be used with BC Wallet et al.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
$ docker build --tag 'proxy' .
```

```bash
$ docker run -p 3000:3000 'proxy'
```

Optionally, you can pass `--user 1014420000` to the above command to simulate an OpenShift environnment.

If you don't want to see the logs, add `--detach` as well.

**Note:** To run locally *without* using Docker, temporarily prefix the base filesystem paths in `src/helpers/agent.ts` with `process.cwd()`

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e
```

## Eslint and Prettier

```bash
# eslint
$ yarn lint

# prettier
$ yarn format
```
