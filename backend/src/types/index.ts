// User Profile
export interface Profile {
  id: string;
  email: string;
  first_name?: string;
  age?: number;
  weight?: number;
  gender?: "male" | "female" | "other";
  created_at: string;
  updated_at: string;
}

// Disciplines
export type Discipline = "running" | "cycling" | "swimming";

// Metric Types
export type MetricType = "vma" | "ftp" | "css";

// Metrics
export interface Metric {
  id: string;
  user_id: string;
  discipline: Discipline;
  metric_type: MetricType;
  value: number;
  unit: string;
  test_date: string;
  created_at: string;
}

// Zones
export interface Zone {
  id: string;
  user_id: string;
  discipline: Discipline;
  zone_number: 1 | 2 | 3 | 4 | 5;
  zone_name: string;
  min_value: number;
  max_value: number;
  percentage_min: number;
  percentage_max: number;
  description: string;
  color: string;
  created_at: string;
  updated_at: string;
}

// Workout Status
export type WorkoutStatus = "planned" | "completed" | "cancelled" | "draft";

// Workout Type
export type WorkoutType = "interval" | "endurance" | "tempo" | "recovery" | "race" | "test";

// Workout
export interface Workout {
  id: string;
  user_id: string;
  title: string;
  discipline: Discipline;
  workout_type: WorkoutType;
  scheduled_date: string;
  duration_minutes?: number;
  distance_km?: number;
  description?: string;
  objective?: string;
  status: WorkoutStatus;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// Workout Block Type
export type BlockType = "warmup" | "main" | "recovery" | "cooldown";

// Workout Block
export interface WorkoutBlock {
  id: string;
  workout_id: string;
  block_order: number;
  block_type: BlockType;
  duration_minutes?: number;
  distance_km?: number;
  zone_id?: string;
  repetitions?: number;
  notes?: string;
  created_at: string;
}

// Training Plan
export type PlanGoal = "Sprint" | "Olympic" | "Half" | "Ironman" | "Custom";
export type PlanLevel = "beginner" | "intermediate" | "advanced";

export interface TrainingPlan {
  id: string;
  user_id: string;
  name: string;
  goal: PlanGoal;
  level: PlanLevel;
  duration_weeks: number;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: any;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}
