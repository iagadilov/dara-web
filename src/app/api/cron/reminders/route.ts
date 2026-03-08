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

  const now = new Date();
  const currentHourUTC = now.getUTCHours();

  const { data: reminders } = await supabase
    .from('reminders')
    .select('telegram_id, remind_hour, timezone')
    .eq('enabled', true);

  if (!reminders || reminders.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  let sent = 0;

  for (const r of reminders) {
    const localHour = getLocalHour(currentHourUTC, r.timezone);
    if (localHour !== r.remind_hour) continue;

    const dayIndex = now.getDay() || 7;
    const daySchedule = SCHEDULE[(dayIndex - 1) % SCHEDULE.length];
    const randomMsg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];

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
  }

  return NextResponse.json({ sent });
}

function getLocalHour(utcHour: number, timezone: string): number {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      hour12: false,
      timeZone: timezone,
    });
    return parseInt(formatter.format(now), 10);
  } catch {
    return (utcHour + 5) % 24; // fallback: Asia/Almaty = UTC+5
  }
}
