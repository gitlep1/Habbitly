DROP DATABASE IF EXISTS habbitly_db;
CREATE DATABASE habbitly_db;

\c habbitly_db;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE habit_frequency AS ENUM ('hourly', 'daily', 'weekly', 'monthly', 'yearly');

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
  about_me TEXT DEFAULT 'I am a new user!',
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
  delete_hash TEXT,
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
  habit_task_description TEXT NOT NULL,
  habit_task_completed BOOLEAN NOT NULL DEFAULT FALSE,
  habit_category TEXT,

  habit_frequency TEXT NOT NULL DEFAULT 'Daily' CHECK (habit_frequency IN ('Daily', 'Weekly', 'Monthly', 'Yearly')),
  repetitions_per_frequency INTEGER NOT NULL DEFAULT 1,

  progress_percentage INTEGER DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  missed_periods_count INTEGER NOT NULL DEFAULT 0,

  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_completed_on TIMESTAMPTZ,
  end_date TIMESTAMPTZ,

  is_active BOOLEAN DEFAULT TRUE,
  has_reached_end_date BOOLEAN DEFAULT FALSE,

  days_of_week_to_complete TEXT[] DEFAULT '{}',
  day_of_month_to_complete INTEGER DEFAULT NULL,
  yearly_month_of_year_to_complete INTEGER DEFAULT NULL,
  yearly_day_of_year_to_complete INTEGER DEFAULT NULL
);

DROP TABLE IF EXISTS habit_history;
CREATE TABLE habit_history (
  id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  habit_id UUID NOT NULL REFERENCES habbits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  habit_name TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('Added', 'Updated', 'Deleted')),
  has_reached_end_date BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS news;
CREATE TABLE news (
  id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS registered_count;
CREATE TABLE registered_count (
  id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  count INTEGER DEFAULT 0
);

DROP TABLE IF EXISTS notifications;
CREATE TABLE notifications (
    id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,

    habit_reminders BOOLEAN DEFAULT TRUE,
    reminder_time TIME WITHOUT TIME ZONE DEFAULT '09:00:00',

    celebrate_milestones BOOLEAN DEFAULT TRUE,
    gentle_nudges BOOLEAN DEFAULT TRUE,
    nudge_after_days INTEGER DEFAULT 3 CHECK (nudge_after_days >= 1 AND nudge_after_days <= 7),
    weekly_summary BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_notifications_timestamp
BEFORE UPDATE ON notifications
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();