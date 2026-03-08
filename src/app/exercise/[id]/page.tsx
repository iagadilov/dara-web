'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { EXERCISES, SOUND_COLORS, type SoundId } from '@/data/exercises';
import { ExerciseTimer } from '@/components/ExerciseTimer';
import { AudioRecorder } from '@/components/AudioRecorder';
import { Diagram } from '@/components/ArticulationDiagram';
import { Button } from '@/components/ui/button';
import { TelegramBackButton } from '@/components/TelegramBackButton';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

type Phase = 'steps' | 'diagram' | 'record';

export default function ExercisePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { completeExercise, completedExercises, updateStreak } = useAppStore();

  const exercise = useMemo(() => EXERCISES.find((e) => e.id === id), [id]);
  const isDone = exercise ? completedExercises.includes(exercise.id) : false;
  const color = exercise
    ? exercise.type === 'warmup'
      ? '#8888A0'
      : SOUND_COLORS[exercise.soundId as SoundId]
    : '#8888A0';

  const hasDiagram = exercise ? exercise.type !== 'warmup' : false;
  const hasRecording = exercise ? exercise.type !== 'warmup' && !!exercise.expectedText : false;

  const phases = useMemo(() => {
    const p: { id: Phase; label: string }[] = [{ id: 'steps', label: 'Как делать' }];
    if (hasDiagram) p.push({ id: 'diagram', label: 'Артикуляция' });
    if (hasRecording) p.push({ id: 'record', label: 'Запись' });
    return p;
  }, [hasDiagram, hasRecording]);

  const [phaseIndex, setPhaseIndex] = useState(0);
  const currentPhase = phases[phaseIndex]?.id ?? 'steps';
  const isLastPhase = phaseIndex >= phases.length - 1;

  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;
    (async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await navigator.wakeLock.request('screen');
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      wakeLock?.release();
    };
  }, []);

  const handleComplete = useCallback(() => {
    if (!exercise) return;
    completeExercise(exercise.id);
    updateStreak();
  }, [exercise, completeExercise, updateStreak]);

  if (!exercise) {
    return (
      <div className="flex flex-col items-center gap-4 pt-20">
        <p>Упражнение не найдено</p>
        <Button variant="secondary" onClick={() => router.push('/home')}>
          На главную
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <TelegramBackButton />
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/home')}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold">{exercise.title}</h1>
          <p className="text-sm text-muted-foreground">{exercise.instruction}</p>
        </div>
        {isDone && <Check className="h-6 w-6 text-green-400" />}
      </div>

      {/* Phase indicator */}
      <div className="flex items-center gap-2">
        {phases.map((phase, i) => (
          <div key={phase.id} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className="h-1 w-full rounded-full transition-all"
              style={{
                backgroundColor: i <= phaseIndex ? color : 'rgba(255,255,255,0.08)',
              }}
            />
            <span
              className="text-xs font-medium transition-colors"
              style={{ color: i <= phaseIndex ? color : '#555' }}
            >
              {phase.label}
            </span>
          </div>
        ))}
      </div>

      {/* Phase content */}
      {currentPhase === 'steps' && (
        <div className="flex flex-col gap-3">
          {exercise.steps.map((step, i) => (
            <div key={i} className="flex gap-3 rounded-2xl bg-card p-4">
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{ backgroundColor: `${color}20`, color }}
              >
                {i + 1}
              </div>
              <p className="text-sm leading-relaxed">{step}</p>
            </div>
          ))}

          {exercise.expectedText && (
            <div className="rounded-2xl border border-border p-4 text-center">
              <p className="text-xs text-muted-foreground">Произнеси:</p>
              <p className="mt-1 font-mono text-lg font-semibold" style={{ color }}>
                {exercise.expectedText}
              </p>
            </div>
          )}
        </div>
      )}

      {currentPhase === 'diagram' && (
        <Diagram id={exercise.soundId as SoundId} color={color} />
      )}

      {currentPhase === 'record' && (
        <AudioRecorder
          soundId={exercise.soundId}
          expectedText={exercise.expectedText}
          tonguePosition={exercise.tonguePosition}
        />
      )}

      {/* Phase navigation */}
      <div className="flex gap-3">
        {phaseIndex > 0 && (
          <Button
            variant="secondary"
            className="rounded-2xl px-5 py-5"
            onClick={() => setPhaseIndex((i) => i - 1)}
          >
            Назад
          </Button>
        )}
        {!isLastPhase && (
          <Button
            className="flex-1 rounded-2xl py-5"
            style={{ backgroundColor: color }}
            onClick={() => setPhaseIndex((i) => i + 1)}
          >
            Далее <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Timer + Done */}
      <div className="flex flex-col items-center gap-4 border-t border-border pt-6">
        <ExerciseTimer duration={exercise.duration} onComplete={handleComplete} />
        <Button
          className="w-full rounded-2xl py-6 text-base"
          onClick={handleComplete}
          disabled={isDone}
          style={!isDone ? { backgroundColor: color } : undefined}
        >
          {isDone ? 'Выполнено' : 'Готово'}
        </Button>
      </div>
    </div>
  );
}
