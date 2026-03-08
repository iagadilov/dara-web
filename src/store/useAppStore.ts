import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

let authPromise: Promise<string | null> | null = null;

async function ensureAuth(): Promise<string | null> {
  if (!authPromise) {
    authPromise = (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) return session.user.id;

        const { data } = await supabase.auth.signInAnonymously();
        return data.user?.id ?? null;
      } catch {
        return null;
      }
    })();
  }
  return authPromise;
}

interface AppState {
  onboardingDone: boolean;
  problemSounds: string[];
  goal: string;
  startDate: string | null;

  completedExercises: string[];
  streak: number;
  lastSessionDate: string | null;

  userId: string | null;
  synced: boolean;

  setOnboardingDone: (sounds: string[], goal: string) => void;
  completeExercise: (id: string) => void;
  updateStreak: () => void;
  getProgramDay: () => number;
  initAuth: () => Promise<void>;
  syncFromSupabase: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      onboardingDone: false,
      problemSounds: [],
      goal: '',
      startDate: null,
      completedExercises: [],
      streak: 0,
      lastSessionDate: null,
      userId: null,
      synced: false,

      initAuth: async () => {
        const uid = await ensureAuth();
        if (uid) set({ userId: uid });
      },

      syncFromSupabase: async () => {
        const uid = await ensureAuth();
        if (!uid) return;

        try {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', uid)
            .single();

          const profile = data as Profile | null;
          if (profile) {
            set({
              onboardingDone: true,
              goal: profile.goal,
              problemSounds: profile.problem_sounds,
              startDate: profile.start_date,
              streak: profile.streak,
              lastSessionDate: profile.last_session_date,
              synced: true,
            });
          }

          const { data: exercises } = await supabase
            .from('completed_exercises')
            .select('exercise_id')
            .eq('user_id', uid);

          if (exercises && exercises.length > 0) {
            set({ completedExercises: exercises.map((e) => e.exercise_id) });
          }
        } catch {
          // offline
        }
      },

      setOnboardingDone: async (sounds, goal) => {
        const startDate = new Date().toISOString().split('T')[0];
        set({ onboardingDone: true, problemSounds: sounds, goal, startDate });

        const uid = await ensureAuth();
        if (!uid) return;
        set({ userId: uid });

        const { error } = await supabase.from('profiles').upsert({
          id: uid,
          goal,
          problem_sounds: sounds,
          start_date: startDate,
        });
        if (error) console.error('[Supabase] profiles upsert:', error.message);
      },

      completeExercise: async (id) => {
        set((s) => ({
          completedExercises: [...new Set([...s.completedExercises, id])],
        }));

        const uid = await ensureAuth();
        if (!uid) return;

        const { error } = await supabase
          .from('completed_exercises')
          .upsert({ user_id: uid, exercise_id: id }, { onConflict: 'user_id,exercise_id' });
        if (error) console.error('[Supabase] exercise upsert:', error.message);
      },

      updateStreak: async () => {
        const today = new Date().toISOString().split('T')[0];
        const { lastSessionDate, streak } = get();
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (lastSessionDate === today) return;
        const newStreak = lastSessionDate === yesterday ? streak + 1 : 1;
        set({ streak: newStreak, lastSessionDate: today });

        const uid = await ensureAuth();
        if (!uid) return;

        const { error } = await supabase
          .from('profiles')
          .update({ streak: newStreak, last_session_date: today })
          .eq('id', uid);
        if (error) console.error('[Supabase] streak update:', error.message);
      },

      getProgramDay: () => {
        const { startDate } = get();
        if (!startDate) return 1;
        const start = new Date(startDate);
        const now = new Date();
        const diff = Math.floor((now.getTime() - start.getTime()) / 86400000);
        return (diff % 7) + 1;
      },
    }),
    { name: 'dara-storage' },
  ),
);
