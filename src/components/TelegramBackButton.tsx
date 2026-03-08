'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTelegram } from './TelegramProvider';

export function TelegramBackButton() {
  const router = useRouter();
  const { isTelegram } = useTelegram();

  useEffect(() => {
    if (!isTelegram) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      try {
        const sdk = await import('@telegram-apps/sdk-react');
        if (sdk.mountBackButton.isAvailable()) {
          sdk.mountBackButton();
          sdk.showBackButton();
          cleanup = sdk.onBackButtonClick(() => {
            router.back();
          });
        }
      } catch {
        // ignore
      }
    })();

    return () => {
      cleanup?.();
      import('@telegram-apps/sdk-react').then((sdk) => {
        try { sdk.hideBackButton(); } catch { /* ignore */ }
      }).catch(() => {});
    };
  }, [isTelegram, router]);

  return null;
}
