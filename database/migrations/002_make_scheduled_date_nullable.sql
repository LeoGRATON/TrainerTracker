-- Migration: Make scheduled_date nullable to support workout templates
-- Templates have scheduled_date = NULL
-- Planned workouts have scheduled_date != NULL

-- Modify the scheduled_date column to allow NULL values
ALTER TABLE workouts ALTER COLUMN scheduled_date DROP NOT NULL;

-- Add a comment to the column
COMMENT ON COLUMN workouts.scheduled_date IS 'NULL = template workout, NOT NULL = scheduled workout';
