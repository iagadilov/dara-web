'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Film, Briefcase, MessageCircle, Check, Sparkles } from 'lucide-react';

const GOALS = [
  { id: 'content', icon: Film, label: 'Контент', desc: 'TikTok / YouTube' },
  { id: 'pitch', icon: Briefcase, label: 'Питчи', desc: 'Выступления и встречи' },
  { id: 'speech', icon: MessageCircle, label: 'Чёткая речь', desc: 'Повседневная дикция' },
];

const SOUNDS = ['С', 'Ш', 'Л', 'Р', 'Н', 'З', 'Ц', 'Ч'] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const setOnboardingDone = useAppStore((s) => s.setOnboardingDone);

  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState('');
  const [sounds, setSounds] = useState<string[]>([]);

  function toggleSound(s: string) {
    setSounds((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  function finish() {
    setOnboardingDone(sounds.map((s) => s.toLowerCase()), goal);
    router.replace('/home');
  }

  return (
    <div className="flex min-h-[80dvh] flex-col">
      {/* Progress dots */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === step ? 'w-8 bg-foreground' : 'w-2 bg-muted-foreground/30'
            }`}
          />
        ))}
      </div>

      {step === 0 && (
        <div className="flex flex-1 flex-col">
          <h1 className="mb-2 text-2xl font-bold">Какая у тебя цель?</h1>
          <p className="mb-6 text-muted-foreground">Это поможет подобрать программу</p>
          <div className="flex flex-1 flex-col gap-3">
            {GOALS.map((g) => (
              <button
                key={g.id}
                onClick={() => setGoal(g.id)}
                className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                  goal === g.id
                    ? 'border-foreground/30 bg-secondary'
                    : 'border-border hover:border-foreground/20'
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                  <g.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold">{g.label}</div>
                  <div className="text-sm text-muted-foreground">{g.desc}</div>
                </div>
                {goal === g.id && <Check className="ml-auto h-5 w-5" />}
              </button>
            ))}
          </div>
          <Button
            className="mt-6 w-full rounded-2xl py-6 text-base"
            disabled={!goal}
            onClick={() => setStep(1)}
          >
            Далее
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-1 flex-col">
          <h1 className="mb-2 text-2xl font-bold">Проблемные звуки</h1>
          <p className="mb-6 text-muted-foreground">
            Выбери звуки, которые хочешь улучшить (минимум 1)
          </p>
          <div className="grid grid-cols-4 gap-3">
            {SOUNDS.map((s) => (
              <button
                key={s}
                onClick={() => toggleSound(s)}
                className={`flex h-16 items-center justify-center rounded-2xl border text-lg font-bold transition-all ${
                  sounds.includes(s)
                    ? 'border-foreground/30 bg-secondary text-foreground'
                    : 'border-border text-muted-foreground hover:border-foreground/20'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="mt-auto flex gap-3 pt-6">
            <Button variant="secondary" className="rounded-2xl px-6 py-6" onClick={() => setStep(0)}>
              Назад
            </Button>
            <Button
              className="flex-1 rounded-2xl py-6 text-base"
              disabled={sounds.length === 0}
              onClick={() => setStep(2)}
            >
              Далее
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-secondary">
            <Sparkles className="h-10 w-10" />
          </div>
          <h1 className="mb-2 text-2xl font-bold">Программа готова</h1>
          <p className="mb-1 text-muted-foreground">7 дней — 15 мин/день</p>
          <p className="mb-8 text-sm text-muted-foreground">
            Звуки: {sounds.join(', ')}
          </p>
          <Button className="w-full rounded-2xl py-6 text-base" onClick={finish}>
            Начать
          </Button>
          <button
            className="mt-3 text-sm text-muted-foreground"
            onClick={() => setStep(1)}
          >
            Назад
          </button>
        </div>
      )}
    </div>
  );
}
