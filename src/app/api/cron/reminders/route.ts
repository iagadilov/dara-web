import { NextResponse } from 'next/server';
import { sendMessage } from '@/lib/telegram';
import { getSupabase } from '@/lib/supabase';
import { SCHEDULE } from '@/data/schedule';

export const dynamic = 'force-dynamic';

const MESSAGES = [
  '🗣 Пора тренировать дикцию! 15 минут — и ты станешь чётче.',
  '💪 Твоя дикция ждёт тренировки! Не пропускай день.',
  '🎯 Регулярность — ключ к результату. Начни сессию!',
  '🔥 Сохрани свой streak! Открой Dara и потренируйся.',
  '✨ Маленькая тренировка сейчас — большой результат потом.',
];

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabase();

  const { data: reminders } = await supabase
    .from('reminders')
    .select('telegram_id')
    .eq('enabled', true);

  if (!reminders || reminders.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  const dayIndex = new Date().getDay() || 7;
  const daySchedule = SCHEDULE[(dayIndex - 1) % SCHEDULE.length];
  const randomMsg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];

  let sent = 0;

  for (const r of reminders) {
    try {
      await sendMessage(r.telegram_id,
        `${randomMsg}\n\n📅 Сегодня: <b>${daySchedule.title}</b>`,
        {
          reply_markup: {
            inline_keyboard: [[
              { text: '🏋️ Начать тренировку', web_app: { url: 'https://dara-iota.vercel.app' } }
            ]],
          },
        },
      );
      sent++;
    } catch {
      // user may have blocked the bot
    }
  }

  return NextResponse.json({ sent });
}
