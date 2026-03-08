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
      '🔔 Чтобы включить напоминания:\n' +
      '<code>/remind 9</code> — напоминание в 9:00\n' +
      '<code>/remind 20</code> — напоминание в 20:00\n\n' +
      '❌ Отключить: <code>/stop</code>\n\n' +
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

  if (text.startsWith('/remind')) {
    const parts = text.split(/\s+/);
    const hour = parseInt(parts[1], 10);

    if (isNaN(hour) || hour < 0 || hour > 23) {
      await sendMessage(chatId, '⚠️ Укажи час от 0 до 23. Пример: <code>/remind 9</code>');
      return NextResponse.json({ ok: true });
    }

    const supabase = getSupabase();
    await supabase.from('reminders').upsert(
      { telegram_id: telegramId, remind_hour: hour, enabled: true },
      { onConflict: 'telegram_id' },
    );

    await sendMessage(chatId,
      `✅ Напоминание установлено на <b>${hour}:00</b> каждый день.\n\nОтключить: /stop`,
    );
    return NextResponse.json({ ok: true });
  }

  if (text === '/stop') {
    const supabase = getSupabase();
    await supabase
      .from('reminders')
      .update({ enabled: false })
      .eq('telegram_id', telegramId);

    await sendMessage(chatId, '🔕 Напоминания отключены. Включить снова: <code>/remind 9</code>');
    return NextResponse.json({ ok: true });
  }

  await sendMessage(chatId,
    'Команды:\n/remind 9 — напоминание в 9:00\n/stop — отключить напоминания',
  );
  return NextResponse.json({ ok: true });
}
