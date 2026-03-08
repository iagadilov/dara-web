import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  onboardingDone: boolean;
  problemSounds: string[];
  goal: string;
  startDate: string | null;

  completedExercises: string[];
  streak: number;
  lastSessionDate: string | null;

  setOnboardingDone: (sounds: string[], goal: string) => void;
  completeExercise: (id: string) => void;
  updateStreak: () => void;
  getProgramDay: () => number;
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

      setOnboardingDone: (sounds, goal) =>
        set({
          onboardingDone: true,
          problemSounds: sounds,
          goal,
          startDate: new Date().toISOString().split('T')[0],
        }),

      completeExercise: (id) =>
        set((s) => ({
          completedExercises: [...new Set([...s.completedExercises, id])],
        })),

      updateStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        const { lastSessionDate, streak } = get();
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (lastSessionDate === today) return;
        const newStreak = lastSessionDate === yesterday ? streak + 1 : 1;
        set({ streak: newStreak, lastSessionDate: today });
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
