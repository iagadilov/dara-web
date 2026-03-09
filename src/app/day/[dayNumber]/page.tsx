'use client';

import { use } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import { EXERCISES, SOUND_COLORS, type SoundId } from '@/data/exercises';
import { SCHEDULE } from '@/data/schedule';
import { TelegramBackButton } from '@/components/TelegramBackButton';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Check, Circle, Clock } from 'lucide-react';

export default function DayPage({ params }: { params: Promise<{ dayNumber: string }> }) {
  const { dayNumber } = use(params);
  const dayNum = Number(dayNumber);
  const { completedExercises } = useAppStore();

  const day = SCHEDULE[dayNum - 1];
  if (!day) return null;

  const exercises = day.exerciseIds
    .map((id) => EXERCISES.find((e) => e.id === id)!)
    .filter(Boolean);
  const doneCount = exercises.filter((e) => completedExercises.includes(e.id)).length;
  const progressPct = exercises.length > 0 ? (doneCount / exercises.length) * 100 : 0;

  return (
    <div className="flex flex-col gap-6">
      <TelegramBackButton />
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/progress"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold">День {day.day} — {day.label}</h1>
          <p className="text-sm text-muted-foreground">{day.title}</p>
        </div>
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

      {doneCount === exercises.length && exercises.length > 0 && (
        <div className="rounded-2xl bg-card p-6 text-center">
          <p className="text-lg font-semibold">Все упражнения выполнены!</p>
          <p className="text-sm text-muted-foreground">Отличная работа.</p>
        </div>
      )}
    </div>
  );
}
