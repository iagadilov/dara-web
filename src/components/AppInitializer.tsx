'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function AppInitializer() {
  const initAuth = useAppStore((s) => s.initAuth);
  const syncFromSupabase = useAppStore((s) => s.syncFromSupabase);
  const userId = useAppStore((s) => s.userId);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (userId) {
      syncFromSupabase();
    }
  }, [userId, syncFromSupabase]);

  return null;
}
