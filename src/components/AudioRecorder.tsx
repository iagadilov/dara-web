'use client';

import { useState, useRef, useCallback } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AudioRecorderProps {
  soundId: string;
  expectedText?: string;
  tonguePosition: string;
}

interface Feedback {
  score: number;
  heard: string;
  issue: string | null;
  tip: string;
}

export function AudioRecorder({ soundId, expectedText, tonguePosition }: AudioRecorderProps) {
  const [state, setState] = useState<'idle' | 'recording' | 'recorded' | 'playing' | 'analyzing'>('idle');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [seconds, setSeconds] = useState(0);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const audioUrl = useRef<string | null>(null);
  const audioEl = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/mp4';

      const recorder = new MediaRecorder(stream, { mimeType });
      chunks.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: mimeType });
        audioUrl.current = URL.createObjectURL(blob);
        stream.getTracks().forEach((t) => t.stop());
        setState('recorded');
      };

      mediaRecorder.current = recorder;
      recorder.start();
      setSeconds(0);
      setFeedback(null);
      setState('recording');

      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s >= 29) {
            recorder.stop();
            if (timerRef.current) clearInterval(timerRef.current);
            return 30;
          }
          return s + 1;
        });
      }, 1000);
    } catch {
      alert('Не удалось получить доступ к микрофону');
    }
  }, []);

  const stopRecording = useCallback(() => {
    mediaRecorder.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const playAudio = useCallback(() => {
    if (!audioUrl.current) return;
    const audio = new Audio(audioUrl.current);
    audioEl.current = audio;
    setState('playing');
    audio.onended = () => setState('recorded');
    audio.play();
  }, []);

  const stopPlayback = useCallback(() => {
    audioEl.current?.pause();
    setState('recorded');
  }, []);

  const reRecord = useCallback(() => {
    if (audioUrl.current) URL.revokeObjectURL(audioUrl.current);
    audioUrl.current = null;
    setFeedback(null);
    setState('idle');
  }, []);

  const analyze = useCallback(async () => {
    if (!audioUrl.current) return;
    setState('analyzing');

    try {
      const resp = await fetch(audioUrl.current);
      const blob = await resp.blob();
      const ext = blob.type.includes('webm') ? 'webm' : 'mp4';
      const file = new File([blob], `recording.${ext}`, { type: blob.type });

      const form = new FormData();
      form.append('audio', file);
      form.append('soundId', soundId);
      form.append('tonguePosition', tonguePosition);
      if (expectedText) form.append('expectedText', expectedText);

      const res = await fetch('/api/analyze', { method: 'POST', body: form });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setFeedback(data.feedback);
    } catch {
      alert('Ошибка анализа. Проверь API ключ.');
    } finally {
      setState('recorded');
    }
  }, [soundId, tonguePosition, expectedText]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Recording indicator */}
      {state === 'recording' && (
        <div className="flex flex-col items-center gap-3">
          <div className="relative flex h-24 w-24 items-center justify-center">
            <div className="absolute h-full w-full animate-ping rounded-full bg-red-500/20" />
            <div className="h-16 w-16 rounded-full bg-red-500/30" />
          </div>
          <span className="font-mono text-2xl">{seconds}s / 30s</span>
        </div>
      )}

      {state === 'analyzing' && (
        <div className="flex flex-col items-center gap-2 py-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Анализирую...</span>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        {state === 'idle' && (
          <Button onClick={startRecording} className="gap-2 rounded-2xl px-6 py-6">
            <Mic className="h-5 w-5" /> Записать
          </Button>
        )}

        {state === 'recording' && (
          <Button onClick={stopRecording} variant="destructive" className="gap-2 rounded-2xl px-6 py-6">
            <Square className="h-5 w-5" /> Стоп
          </Button>
        )}

        {(state === 'recorded' || state === 'playing') && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={reRecord}
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={state === 'playing' ? stopPlayback : playAudio}
            >
              {state === 'playing' ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={analyze}
            >
              <Send className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

      {/* Feedback */}
      {feedback && (
        <div className="w-full rounded-2xl bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold">Результат</span>
            <span className="font-mono text-2xl font-bold">{feedback.score}/10</span>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Услышано: </span>
              {feedback.heard}
            </div>
            {feedback.issue && (
              <div className="rounded-xl bg-destructive/10 p-3 text-destructive">
                {feedback.issue}
              </div>
            )}
            <div className="rounded-xl bg-secondary p-3">{feedback.tip}</div>
          </div>
        </div>
      )}
    </div>
  );
}
