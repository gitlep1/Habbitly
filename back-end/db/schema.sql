DROP DATABASE IF EXISTS habbitly_db;
CREATE DATABASE habbitly_db;

\c habbitly_db;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE habit_interval AS ENUM ('hourly', 'daily', 'weekly', 'monthly', 'yearly');

DROP TABLE IF EXISTS email_verification;
CREATE TABLE email_verification (
  id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  profileimg TEXT DEFAULT 'https://i.imgur.com/yJVGXuM.png',
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  theme TEXT DEFAULT 'default',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_online TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS profile_images;
CREATE TABLE profile_images (
  id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  delete_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS timed_account_deletions;
CREATE TABLE timed_account_deletions (
  id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  deletion_date TIMESTAMP NOT NULL
);

DROP TABLE IF EXISTS habbits;
CREATE TABLE habbits (
  id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  habit_name TEXT NOT NULL,
  habit_task TEXT,
  habit_task_completed BOOLEAN DEFAULT FALSE,
  habit_category TEXT,
  habit_interval TEXT DEFAULT 'daily',
  habit_progress INTEGER DEFAULT 0,
  times_per_interval INTEGER DEFAULT 1,
  start_date DATE DEFAULT NOW() NOT NULL,
  last_completed_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  habit_completed BOOLEAN DEFAULT FALSE
);

DROP TABLE IF EXISTS news;
CREATE TABLE news (
  id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);