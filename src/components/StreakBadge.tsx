'use client';

import { useAppStore } from '@/store/useAppStore';
import { Flame } from 'lucide-react';

export function StreakBadge() {
  const streak = useAppStore((s) => s.streak);

  if (streak === 0) return null;

  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm font-semibold">
      <Flame className="h-4 w-4 text-orange-400" />
      {streak} {streak === 1 ? 'день' : streak < 5 ? 'дня' : 'дней'}
    </div>
  );
}
