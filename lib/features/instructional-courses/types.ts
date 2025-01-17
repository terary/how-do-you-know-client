export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface InstructionalCourse {
  id: string;
  name: string;
  description: string;
  start_date: string;
  finish_date: string;
  start_time_utc: string;
  duration_minutes: number;
  days_of_week: DayOfWeek[];
  institution_id: string;
  instructor_id: string;
  proctor_ids: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateInstructionalCourseDto {
  name: string;
  description: string;
  start_date: string;
  finish_date: string;
  start_time_utc: string;
  duration_minutes: number;
  days_of_week: DayOfWeek[];
  institution_id: string;
  instructor_id: string;
  proctor_ids: string[];
}

export interface UpdateInstructionalCourseDto {
  name?: string;
  description?: string;
  start_date?: string;
  finish_date?: string;
  start_time_utc?: string;
  duration_minutes?: number;
  days_of_week?: DayOfWeek[];
  institution_id?: string;
  instructor_id?: string;
  proctor_ids?: string[];
}
