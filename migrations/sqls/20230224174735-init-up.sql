CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "User" (
  id       UUID         DEFAULT uuid_generate_v4(),
  login    VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role     VARCHAR(255) NOT NULL
);
