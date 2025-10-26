-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  points INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Materials table
CREATE TABLE IF NOT EXISTS materials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK(category IN ('HTML', 'CSS', 'JavaScript', 'DOM', 'Project')),
  level TEXT NOT NULL CHECK(level IN ('Beginner', 'Intermediate', 'Advanced')),
  order_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  code_example TEXT,
  challenge_question TEXT,
  challenge_expected TEXT,
  challenge_hint TEXT,
  points INTEGER DEFAULT 10,
  status TEXT DEFAULT 'published' CHECK(status IN ('published', 'draft')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Progress table
CREATE TABLE IF NOT EXISTS progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  material_id INTEGER NOT NULL,
  completed INTEGER DEFAULT 0,
  code_submitted TEXT,
  completed_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE,
  UNIQUE(user_id, material_id)
);

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  icon_url TEXT,
  condition_type TEXT NOT NULL CHECK(condition_type IN ('lessons_completed', 'points_reached', 'streak_days', 'category_master')),
  condition_value INTEGER NOT NULL,
  condition_category TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- User badges (unlocked)
CREATE TABLE IF NOT EXISTS user_badges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  badge_id INTEGER NOT NULL,
  unlocked_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
  UNIQUE(user_id, badge_id)
);

-- Streak history
CREATE TABLE IF NOT EXISTS streak_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  activities_count INTEGER DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_materials_category ON materials(category);
CREATE INDEX IF NOT EXISTS idx_materials_order ON materials(order_index);
CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_material ON progress(material_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_streak_history_user ON streak_history(user_id, date);
