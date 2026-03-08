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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
