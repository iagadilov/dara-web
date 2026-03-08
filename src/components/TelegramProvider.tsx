'use client';

import { useEffect, useState, createContext, useContext } from 'react';

interface TelegramContext {
  isTelegram: boolean;
  userId?: number;
  firstName?: string;
}

const TgContext = createContext<TelegramContext>({ isTelegram: false });

export function useTelegram() {
  return useContext(TgContext);
}

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [ctx, setCtx] = useState<TelegramContext>({ isTelegram: false });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const sdk = await import('@telegram-apps/sdk-react');

        if (sdk.isTMA()) {
          sdk.init();

          if (sdk.mountViewport.isAvailable()) {
            await sdk.mountViewport();
          }
          if (sdk.expandViewport.isAvailable()) {
            sdk.expandViewport();
          }
          if (sdk.bindViewportCssVars.isAvailable()) {
            sdk.bindViewportCssVars();
          }

          const lp = sdk.retrieveLaunchParams(true);
          const initData = lp.initData as { user?: { id?: number; firstName?: string } } | undefined;

          setCtx({
            isTelegram: true,
            userId: initData?.user?.id,
            firstName: initData?.user?.firstName,
          });
        }
      } catch {
        // Not in Telegram environment
      }
      setReady(true);
    })();
  }, []);

  if (!ready) return null;

  return <TgContext.Provider value={ctx}>{children}</TgContext.Provider>;
}
