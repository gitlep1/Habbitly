DROP DATABASE IF EXISTS habbitly;
CREATE DATABASE habbitly;

\c habbitly;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE habit_interval AS ENUM ('hourly', 'daily', 'weekly', 'monthly', 'yearly');

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  profileimg TEXT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  theme TEXT DEFAULT 'default',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_online TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS habbits;
CREATE TABLE habbits (
  id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  goal TEXT,
  category TEXT,
  interval habit_interval DEFAULT 'daily',
  times_per_interval INTEGER DEFAULT 1,
  start_date DATE DEFAULT NOW(),
  last_completed_date DATE,
  streak INTEGER DEFAULT 0,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  completed BOOLEAN DEFAULT FALSE
);