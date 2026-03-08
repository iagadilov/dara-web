'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import { EXERCISES } from '@/data/exercises';
import { SCHEDULE } from '@/data/schedule';
import { StreakBadge } from '@/components/StreakBadge';
import { ArrowLeft, Check, Circle } from 'lucide-react';

export default function ProgressPage() {
  const { completedExercises } = useAppStore();

  const totalExercises = EXERCISES.length;
  const totalDone = completedExercises.length;

  const weekData = useMemo(
    () =>
      SCHEDULE.map((day) => {
        const dayExercises = day.exerciseIds;
        const done = dayExercises.filter((id) => completedExercises.includes(id)).length;
        return { ...day, done, total: dayExercises.length };
      }),
    [completedExercises],
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/home"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold">Прогресс</h1>
        <div className="ml-auto">
          <StreakBadge />
        </div>
      </div>

      {/* Overall stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-card p-4 text-center">
          <p className="font-mono text-3xl font-bold">{totalDone}</p>
          <p className="text-xs text-muted-foreground">Упражнений выполнено</p>
        </div>
        <div className="rounded-2xl bg-card p-4 text-center">
          <p className="font-mono text-3xl font-bold">{totalExercises}</p>
          <p className="text-xs text-muted-foreground">Всего упражнений</p>
        </div>
      </div>

      {/* Week schedule */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Неделя</h2>
        <div className="flex flex-col gap-2">
          {weekData.map((day) => {
            const allDone = day.done === day.total;
            return (
              <div
                key={day.day}
                className={`flex items-center gap-3 rounded-2xl bg-card p-4 ${
                  allDone ? 'opacity-60' : ''
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary font-mono text-sm font-bold">
                  {day.label}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{day.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {day.done}/{day.total} упражнений
                  </p>
                </div>
                {allDone ? (
                  <Check className="h-5 w-5 text-green-400" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
