DROP DATABASE IF EXISTS habbitly;
CREATE DATABASE habbitly;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  profileimg TEXT,
  username TEXT UNIQUE NOT NULL,
  password TEXT,
  email TEXT UNIQUE,
  theme TEXT DEFAULT 'default',
  last_online TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS habbit;
CREATE TABLE habbit (
  id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  habbit_name TEXT NOT NULL,
  habbit_description TEXT,
  habbit_category TEXT,
  habbit_frequency TEXT,
  habbit_start_date DATE DEFAULT NOW(),
  habbit_end_date DATE,
  habbit_streak INTEGER DEFAULT 0,
  habbit_completed BOOLEAN DEFAULT FALSE
);