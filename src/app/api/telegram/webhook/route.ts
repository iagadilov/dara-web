import { NextResponse } from 'next/server';
import { sendMessage } from '@/lib/telegram';
import { getSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

interface TelegramUpdate {
  message?: {
    chat: { id: number };
    from?: { id: number; first_name?: string };
    text?: string;
  };
}

export async function POST(req: Request) {
  const update: TelegramUpdate = await req.json();
  const msg = update.message;
  if (!msg?.text) return NextResponse.json({ ok: true });

  const chatId = msg.chat.id;
  const telegramId = msg.from?.id ?? chatId;
  const text = msg.text.trim();

  if (text === '/start') {
    await sendMessage(chatId,
      '👋 Привет! Я бот <b>Dara</b> — тренажёр дикции.\n\n' +
      '🔔 /remind — включить ежедневные напоминания (9:00)\n' +
      '❌ /stop — отключить напоминания\n\n' +
      '🎯 Открой тренажёр:',
      {
        reply_markup: {
          inline_keyboard: [[
            { text: '🏋️ Открыть Dara', web_app: { url: 'https://dara-iota.vercel.app' } }
          ]],
        },
      },
    );
    return NextResponse.json({ ok: true });
  }

  if (text === '/remind') {
    const supabase = getSupabase();
    await supabase.from('reminders').upsert(
      { telegram_id: telegramId, enabled: true },
      { onConflict: 'telegram_id' },
    );

    await sendMessage(chatId,
      '✅ Ежедневные напоминания включены! Буду писать каждое утро.\n\nОтключить: /stop',
    );
    return NextResponse.json({ ok: true });
  }

  if (text === '/stop') {
    const supabase = getSupabase();
    await supabase
      .from('reminders')
      .update({ enabled: false })
      .eq('telegram_id', telegramId);

    await sendMessage(chatId, '🔕 Напоминания отключены. Включить снова: /remind');
    return NextResponse.json({ ok: true });
  }

  await sendMessage(chatId,
    'Команды:\n/remind — включить напоминания\n/stop — отключить напоминания',
  );
  return NextResponse.json({ ok: true });
}
