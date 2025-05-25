\c habbitly_db;

INSERT INTO news (title, content, created_at) VALUES 
('First Post', 'Habbitly work in progress', '2024-12-01 10:00:00'),
('Habbitly Beta Launch', 'We are excited to announce that Habbitly has officially entered beta! Sign up to be an early tester.', '2025-01-15 09:30:00'),
('New Feature: AI Habit Suggestions', 'Habbitly can now recommend habits based on your behavior and preferences. Try it out in your dashboard.', '2025-02-05 14:45:00'),
('Daily Streak Tracker Update', 'You can now see your longest streaks and current streaks with detailed analytics.', '2025-03-01 08:00:00'),
('Motivation Feed Live', 'Stay inspired with daily motivational quotes tailored to your goals.', '2025-03-18 11:20:00'),
('User Feedback Form', 'We value your thoughts. Fill out our new feedback form to help us improve Habbitly.', '2025-04-02 17:05:00'),
('Mobile App Incoming', 'The Habbitly mobile app is under development! Sneak peeks coming soon.', NOW()),
('Bug Fixes and Performance Boosts', 'We squashed a few bugs and improved the speed of habit tracking.', '2025-04-20 13:15:00'),
('Team Spotlight: Meet the Devs', 'Get to know the passionate developers behind Habbitly in our new blog series.', '2025-05-01 15:00:00'),
('Upcoming: Social Habit Circles', 'Soon, you will be able to join habit circles with friends or the community for accountability.', '2025-05-10 12:00:00');

INSERT INTO registered_count (count) VALUES (0);