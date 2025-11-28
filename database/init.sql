-- TriZone Database Schema
-- Execute this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  age INTEGER CHECK (age > 0 AND age < 150),
  weight NUMERIC CHECK (weight > 0),
  height NUMERIC CHECK (height > 0),
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- METRICS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  discipline TEXT NOT NULL CHECK (discipline IN ('running', 'cycling', 'swimming')),
  metric_type TEXT NOT NULL CHECK (metric_type IN ('vma', 'ftp', 'css')),
  value NUMERIC NOT NULL CHECK (value > 0),
  unit TEXT NOT NULL,
  test_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_metrics_user_id ON metrics(user_id);
CREATE INDEX idx_metrics_discipline ON metrics(discipline);
CREATE INDEX idx_metrics_test_date ON metrics(test_date DESC);

-- Enable RLS
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage own metrics" ON metrics
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- ZONES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  discipline TEXT NOT NULL CHECK (discipline IN ('running', 'cycling', 'swimming')),
  zone_number INTEGER NOT NULL CHECK (zone_number BETWEEN 1 AND 5),
  zone_name TEXT NOT NULL,
  min_value NUMERIC NOT NULL CHECK (min_value > 0),
  max_value NUMERIC NOT NULL CHECK (max_value > min_value),
  percentage_min NUMERIC NOT NULL CHECK (percentage_min >= 0 AND percentage_min <= 100),
  percentage_max NUMERIC NOT NULL CHECK (percentage_max >= 0 AND percentage_max <= 100 AND percentage_max >= percentage_min),
  description TEXT,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, discipline, zone_number)
);

-- Indexes
CREATE INDEX idx_zones_user_id ON zones(user_id);
CREATE INDEX idx_zones_discipline ON zones(discipline);

-- Enable RLS
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage own zones" ON zones
  FOR ALL USING (auth.uid() = user_id);

-- Trigger to update updated_at
CREATE TRIGGER update_zones_updated_at
  BEFORE UPDATE ON zones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- WORKOUTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  discipline TEXT NOT NULL CHECK (discipline IN ('running', 'cycling', 'swimming')),
  workout_type TEXT NOT NULL CHECK (workout_type IN ('interval', 'endurance', 'tempo', 'recovery', 'race', 'test')),
  scheduled_date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER CHECK (duration_minutes > 0),
  distance_km NUMERIC CHECK (distance_km > 0),
  description TEXT,
  objective TEXT,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'completed', 'cancelled', 'draft')),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_workouts_user_id ON workouts(user_id);
CREATE INDEX idx_workouts_scheduled_date ON workouts(scheduled_date);
CREATE INDEX idx_workouts_status ON workouts(status);
CREATE INDEX idx_workouts_discipline ON workouts(discipline);

-- Enable RLS
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage own workouts" ON workouts
  FOR ALL USING (auth.uid() = user_id);

-- Trigger to update updated_at
CREATE TRIGGER update_workouts_updated_at
  BEFORE UPDATE ON workouts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- WORKOUT BLOCKS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS workout_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID REFERENCES workouts ON DELETE CASCADE NOT NULL,
  block_order INTEGER NOT NULL CHECK (block_order > 0),
  block_type TEXT NOT NULL CHECK (block_type IN ('warmup', 'main', 'recovery', 'cooldown')),
  duration_minutes INTEGER CHECK (duration_minutes > 0),
  distance_km NUMERIC CHECK (distance_km > 0),
  zone_id UUID REFERENCES zones ON DELETE SET NULL,
  repetitions INTEGER DEFAULT 1 CHECK (repetitions > 0),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workout_id, block_order)
);

-- Indexes
CREATE INDEX idx_workout_blocks_workout_id ON workout_blocks(workout_id);
CREATE INDEX idx_workout_blocks_zone_id ON workout_blocks(zone_id);

-- Enable RLS
ALTER TABLE workout_blocks ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage blocks of own workouts" ON workout_blocks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM workouts
      WHERE workouts.id = workout_blocks.workout_id
      AND workouts.user_id = auth.uid()
    )
  );

-- ============================================================================
-- TRAINING PLANS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS training_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  goal TEXT NOT NULL CHECK (goal IN ('Sprint', 'Olympic', 'Half', 'Ironman', 'Custom')),
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration_weeks INTEGER NOT NULL CHECK (duration_weeks > 0),
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (end_date IS NULL OR start_date IS NULL OR end_date > start_date)
);

-- Indexes
CREATE INDEX idx_training_plans_user_id ON training_plans(user_id);
CREATE INDEX idx_training_plans_is_active ON training_plans(is_active);

-- Enable RLS
ALTER TABLE training_plans ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage own training plans" ON training_plans
  FOR ALL USING (auth.uid() = user_id);

-- Trigger to update updated_at
CREATE TRIGGER update_training_plans_updated_at
  BEFORE UPDATE ON training_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to create a profile automatically when a user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- SEED DATA (Optional)
-- ============================================================================

-- Example zone colors (can be customized)
-- Zone 1: Blue (Recovery)     - hsl(220, 90%, 56%)  -> #4A90E2
-- Zone 2: Green (Endurance)   - hsl(142, 71%, 45%)  -> #21A366
-- Zone 3: Yellow (Tempo)      - hsl(48, 96%, 53%)   -> #F5D328
-- Zone 4: Orange (Threshold)  - hsl(25, 95%, 53%)   -> #FA6E22
-- Zone 5: Red (VO2max)        - hsl(0, 84%, 60%)    -> #EB5757

-- ============================================================================
-- VIEWS (Optional - for easier querying)
-- ============================================================================

-- View to get latest metrics per discipline
CREATE OR REPLACE VIEW latest_metrics AS
SELECT DISTINCT ON (user_id, discipline, metric_type)
  id,
  user_id,
  discipline,
  metric_type,
  value,
  unit,
  test_date,
  created_at
FROM metrics
ORDER BY user_id, discipline, metric_type, test_date DESC;

-- View to get upcoming workouts
CREATE OR REPLACE VIEW upcoming_workouts AS
SELECT *
FROM workouts
WHERE status = 'planned'
  AND scheduled_date >= NOW()
ORDER BY scheduled_date ASC;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant select on views to authenticated users
GRANT SELECT ON latest_metrics TO authenticated;
GRANT SELECT ON upcoming_workouts TO authenticated;

-- ============================================================================
-- COMPLETED
-- ============================================================================

-- All tables, policies, triggers, and functions have been created
-- Run this script in your Supabase SQL Editor to set up the database
