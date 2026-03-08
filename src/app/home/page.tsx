'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import { EXERCISES, SOUND_COLORS, type SoundId } from '@/data/exercises';
import { SCHEDULE } from '@/data/schedule';
import { StreakBadge } from '@/components/StreakBadge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Check, Circle, Clock, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const { completedExercises, updateStreak, getProgramDay } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    updateStreak();
  }, [updateStreak]);

  if (!mounted) return null;

  const today = SCHEDULE[getProgramDay() - 1];
  const exercises = today.exerciseIds
    .map((id) => EXERCISES.find((e) => e.id === id)!)
    .filter(Boolean);
  const doneCount = exercises.filter((e) => completedExercises.includes(e.id)).length;
  const progressPct = exercises.length > 0 ? (doneCount / exercises.length) * 100 : 0;
  const nextExercise = exercises.find((e) => !completedExercises.includes(e.id));

  const dayLabel = new Date().toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm capitalize text-muted-foreground">{dayLabel}</p>
          <h1 className="text-xl font-bold">День {today.day}</h1>
        </div>
        <StreakBadge />
      </div>

      {/* Progress */}
      <div className="rounded-2xl bg-card p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Прогресс</span>
          <span className="font-mono font-semibold">
            {doneCount}/{exercises.length}
          </span>
        </div>
        <Progress value={progressPct} className="h-2" />
      </div>

      {/* Today title */}
      <div>
        <h2 className="text-lg font-semibold">{today.title}</h2>
      </div>

      {/* Exercise list */}
      <div className="flex flex-col gap-2">
        {exercises.map((ex) => {
          const done = completedExercises.includes(ex.id);
          const color = ex.type === 'warmup' ? '#8888A0' : SOUND_COLORS[ex.soundId as SoundId];

          return (
            <Link
              key={ex.id}
              href={`/exercise/${ex.id}`}
              className={`flex items-center gap-3 rounded-2xl border p-4 transition-all ${
                done
                  ? 'border-border/50 opacity-60'
                  : 'border-border hover:border-foreground/20'
              }`}
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: done ? 'transparent' : `${color}20`, color }}
              >
                {done ? (
                  <Check className="h-5 w-5 text-green-400" />
                ) : (
                  <Circle className="h-4 w-4" style={{ color }} />
                )}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{ex.title}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {ex.duration} сек
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Continue button */}
      {nextExercise && (
        <Link href={`/exercise/${nextExercise.id}`}>
          <Button className="w-full rounded-2xl py-6 text-base">
            Продолжить <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      )}

      {doneCount === exercises.length && exercises.length > 0 && (
        <div className="rounded-2xl bg-card p-6 text-center">
          <p className="text-lg font-semibold">Сессия завершена!</p>
          <p className="text-sm text-muted-foreground">Отличная работа. Увидимся завтра.</p>
        </div>
      )}

      {/* Progress link */}
      <Link
        href="/progress"
        className="text-center text-sm text-muted-foreground hover:text-foreground"
      >
        Статистика и прогресс
      </Link>
    </div>
  );
}
