# Nevezide - Formations APIs

Contains following APIs
- Login
- User CRUD

## Requirements
- NodeJS engine
- PostgreSQL engine with 2 DBs : school and school_test

## The package contains
- Express : The NodeJS server framework
- Mocha : test framework for NodeJS : https://mochajs.org/
- Chai, Chai-http : API test and assertions : https://www.chaijs.com/
- C8 : test coverage audit and reporting : https://www.npmjs.com/package/c8
- Db-migrate : to manage db migrations : https://db-migrate.readthedocs.io/

## Setup

Copy .env.sample to .env
Set .env variables, as following conditions :

```bash
NODE_ENV = # prod | dev
API_PORT = # API listening port
TOKEN_SECRET = # Salt for JWT signature
TOKEN_EXPIRATION = # JWT expiration delay (ex: 1800s for 30 minutes)

PROD_DATABASE_URL = # Production | Dev DB connection string (as postgres://user:password@localhost:5432/school)
TEST_DATABASE_URL = # Test DB connection string (as postgres://user:password@localhost:5432/school_test)

```

## Use it

### Install dependencies

```bash
npm i
```

### Migrate the DB

```bash
db-migrate up
```

### Launch it for developement

```bash
npm start
```

## Test and Develop it

### Test with coverage audit

```bash
npm test
```

Will generate a report into the terminal
For more readable reportings, check the doc : https://github.com/bcoe/c8

### Test driven developement

```bash
npm run tdd
```

## Further information

Mocha test framework : https://mochajs.org/#getting-started
Chai assertions : https://www.chaijs.com/api/assert/
Test coverage options and reportings : https://github.com/bcoe/c8
