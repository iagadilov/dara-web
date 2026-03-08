export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          goal: string;
          problem_sounds: string[];
          start_date: string;
          streak: number;
          last_session_date: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          goal?: string;
          problem_sounds?: string[];
          start_date?: string;
          streak?: number;
          last_session_date?: string | null;
        };
        Update: {
          goal?: string;
          problem_sounds?: string[];
          start_date?: string;
          streak?: number;
          last_session_date?: string | null;
        };
        Relationships: [];
      };
      completed_exercises: {
        Row: {
          id: string;
          user_id: string;
          exercise_id: string;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exercise_id: string;
          completed_at?: string;
        };
        Update: {
          user_id?: string;
          exercise_id?: string;
          completed_at?: string;
        };
        Relationships: [];
      };
      reminders: {
        Row: {
          id: string;
          telegram_id: number;
          remind_hour: number;
          timezone: string;
          enabled: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          telegram_id: number;
          remind_hour?: number;
          timezone?: string;
          enabled?: boolean;
        };
        Update: {
          remind_hour?: number;
          timezone?: string;
          enabled?: boolean;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
