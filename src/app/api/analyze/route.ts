import OpenAI from 'openai';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const openai = new OpenAI();
  const formData = await req.formData();
  const audio = formData.get('audio') as File;
  const expectedText = formData.get('expectedText') as string;
  const soundId = formData.get('soundId') as string;
  const tonguePosition = formData.get('tonguePosition') as string;

  const transcription = await openai.audio.transcriptions.create({
    file: audio,
    model: 'whisper-1',
    language: 'ru',
  });

  const analysis = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `Ты логопед-тренер. Анализируй произношение по транскрипции.
Звук: ${soundId.toUpperCase()}
Правильное положение языка: ${tonguePosition}
Ожидаемый текст: "${expectedText}"

Дай конкретный фидбек:
1. Что услышал (сравни с ожидаемым)
2. Конкретная ошибка если есть — в каком слове, какой звук
3. Одна конкретная рекомендация по положению языка (простыми словами, без терминов)

Ответ строго в JSON: {"score": 1-10, "heard": "...", "issue": "..." | null, "tip": "..."}`,
      },
      {
        role: 'user',
        content: `Транскрипция: "${transcription.text}"`,
      },
    ],
    response_format: { type: 'json_object' },
  });

  const feedback = JSON.parse(analysis.choices[0].message.content!);
  return Response.json({ transcript: transcription.text, feedback });
}
