'use client';

import type { SoundId } from '@/data/exercises';
import type { ReactNode } from 'react';

interface DiagramData {
  feel: string;
  steps: { icon: string; text: string }[];
  airLabel: string;
  tongue: string;
  tipX: number;
  tipY: number;
  tipLabel: string;
  tipLabelX: number;
  tipLabelY: number;
  airArrows: (color: string, id: string) => ReactNode;
  shapeNote: string;
  softPalate?: string;
}

const data: Record<SoundId, DiagramData> = {
  s: {
    feel: 'Поднеси руку ко рту — холодная узкая струя',
    steps: [
      { icon: '😁', text: 'Улыбнись — зубы почти сомкнуты' },
      { icon: '👇', text: 'Кончик языка упри в нижние зубы изнутри' },
      { icon: '💨', text: 'Выдыхай тонкую холодную струю по центру' },
    ],
    airLabel: 'холодная струя',
    tongue:
      'M 98,168 Q 140,158 190,155 Q 250,152 295,158 Q 310,162 310,172 Q 270,182 200,184 Q 140,184 108,178 Z',
    tipX: 98,
    tipY: 165,
    tipLabel: 'кончик внизу',
    tipLabelX: 148,
    tipLabelY: 150,
    airArrows: (color, id) => (
      <line x1="72" y1="138" x2="24" y2="138" stroke={color} strokeWidth="3" strokeDasharray="6,3" markerEnd={`url(#a${id})`} opacity="0.9" />
    ),
    shapeNote: 'плоский',
  },
  sh: {
    feel: 'Поднеси руку — тёплая широкая струя. Губы округлые',
    steps: [
      { icon: '🫦', text: 'Губы округли и чуть выдвинь вперёд' },
      { icon: '🥄', text: 'Язык — форма ложки: кончик вверх, середина вогнута' },
      { icon: '💨', text: 'Выдыхай тёплую широкую струю' },
    ],
    airLabel: 'тёплая струя',
    tongue:
      'M 100,120 Q 118,112 145,122 Q 175,138 210,148 Q 255,155 295,155 Q 310,158 310,170 Q 270,180 200,182 Q 140,180 112,168 Q 96,155 96,138 Z',
    tipX: 100,
    tipY: 118,
    tipLabel: 'кончик вверх',
    tipLabelX: 152,
    tipLabelY: 108,
    airArrows: (color, id) => (
      <>
        <line x1="72" y1="132" x2="24" y2="128" stroke={color} strokeWidth="3.5" strokeDasharray="6,3" markerEnd={`url(#a${id})`} opacity="0.9" />
        <line x1="72" y1="148" x2="24" y2="154" stroke={color} strokeWidth="2" strokeDasharray="6,3" markerEnd={`url(#a${id})`} opacity="0.5" />
      </>
    ),
    shapeNote: 'ложка',
  },
  l: {
    feel: 'Язык как мост — воздух идёт только по краям, не по центру',
    steps: [
      { icon: '☝️', text: 'Кончик языка касается верхних зубов изнутри' },
      { icon: '↔️', text: 'Края языка опущены с обеих сторон' },
      { icon: '💨', text: 'Воздух выходит по БОКАМ — не по центру' },
    ],
    airLabel: 'по бокам',
    tongue:
      'M 98,118 Q 130,115 170,128 Q 220,142 278,152 Q 305,156 310,166 Q 270,178 200,180 Q 140,178 110,168 Q 94,156 94,138 Z',
    tipX: 98,
    tipY: 116,
    tipLabel: 'у верхних зубов',
    tipLabelX: 152,
    tipLabelY: 106,
    airArrows: (color, id) => (
      <>
        <line x1="72" y1="118" x2="24" y2="108" stroke={color} strokeWidth="2.5" strokeDasharray="6,3" markerEnd={`url(#a${id})`} opacity="0.9" />
        <line x1="72" y1="160" x2="24" y2="172" stroke={color} strokeWidth="2.5" strokeDasharray="6,3" markerEnd={`url(#a${id})`} opacity="0.9" />
      </>
    ),
    shapeNote: 'мост',
  },
  r: {
    feel: 'Кончик вибрирует от сильного потока воздуха',
    steps: [
      { icon: '☝️', text: 'Подними кончик — упри в нёбо сразу за верхними зубами' },
      { icon: '💨', text: 'Выдыхай СИЛЬНУЮ струю — кончик начнёт дрожать' },
      { icon: '🥁', text: 'Тренировка: д-д-д-дрр быстро' },
    ],
    airLabel: 'сильная струя',
    tongue:
      'M 98,115 Q 122,108 155,118 Q 192,130 240,145 Q 282,155 310,162 Q 310,174 280,178 Q 210,182 148,176 Q 108,168 92,150 Q 88,134 92,122 Z',
    tipX: 98,
    tipY: 113,
    tipLabel: 'вибрация',
    tipLabelX: 148,
    tipLabelY: 100,
    airArrows: (color, id) => (
      <>
        <line x1="72" y1="138" x2="20" y2="138" stroke={color} strokeWidth="4.5" strokeDasharray="5,2" markerEnd={`url(#a${id})`} opacity="0.95" />
        <path d="M 84,104 Q 89,98 94,104 Q 99,110 104,104" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
        <path d="M 80,94 Q 87,86 94,94 Q 101,102 108,94" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
      </>
    ),
    shapeNote: 'кончик вверх',
  },
  n: {
    feel: 'Прижми пальцы к носу — почувствуешь лёгкий гул',
    steps: [
      { icon: '🔒', text: 'Язык плотно прижат к верхним зубам — как пробка' },
      { icon: '👃', text: 'Весь воздух идёт только через нос' },
      { icon: '🎵', text: 'Почувствуй: нос слегка гудит' },
    ],
    airLabel: 'через нос',
    tongue:
      'M 96,116 Q 122,108 162,118 Q 208,130 262,144 Q 296,154 310,162 Q 310,175 275,180 Q 210,184 148,178 Q 104,168 88,150 Q 82,132 88,118 Z',
    tipX: 96,
    tipY: 114,
    tipLabel: 'пробка',
    tipLabelX: 148,
    tipLabelY: 100,
    softPalate: 'M 312,100 Q 304,126 292,150 Q 286,166 282,178',
    airArrows: (color, id) => (
      <>
        <path
          d="M 190,72 Q 168,52 144,40 Q 124,30 104,24"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray="6,3"
          markerEnd={`url(#a${id})`}
          opacity="0.9"
        />
        {/* Blocked mouth */}
        <line x1="26" y1="128" x2="44" y2="148" stroke="#FF5555" strokeWidth="2.5" opacity="0.7" />
        <line x1="44" y1="128" x2="26" y2="148" stroke="#FF5555" strokeWidth="2.5" opacity="0.7" />
      </>
    ),
    shapeNote: 'пробка',
  },
  z: {
    feel: 'Рука на горле — С не гудит, З гудит',
    steps: [
      { icon: '🔁', text: 'Язык и губы точно как при С' },
      { icon: '🔊', text: 'Включи голос — горло должно гудеть' },
      { icon: '✋', text: 'Проверь рукой: С (тихо) → З (вибрация)' },
    ],
    airLabel: 'струя + голос',
    tongue:
      'M 98,168 Q 140,158 190,155 Q 250,152 295,158 Q 310,162 310,172 Q 270,182 200,184 Q 140,184 108,178 Z',
    tipX: 98,
    tipY: 165,
    tipLabel: 'внизу (как С)',
    tipLabelX: 150,
    tipLabelY: 150,
    airArrows: (color, id) => (
      <>
        <line x1="72" y1="138" x2="24" y2="138" stroke={color} strokeWidth="3" strokeDasharray="6,3" markerEnd={`url(#a${id})`} opacity="0.9" />
        {/* Voice vibration at throat */}
        <path d="M 318,170 Q 323,165 328,170 Q 333,175 338,170" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <path d="M 318,180 Q 323,185 328,180 Q 333,175 338,180" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      </>
    ),
    shapeNote: 'плоский',
  },
};

interface DiagramProps {
  id: SoundId;
  color?: string;
}

export function Diagram({ id, color = '#4ECDC4' }: DiagramProps) {
  const d = data[id];
  if (!d) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Clean SVG Diagram — no cluttering labels */}
      <div className="overflow-hidden rounded-2xl bg-[#0A0A14]">
        <svg viewBox="0 0 370 270" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <defs>
            <marker id={`a${id}`} markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
              <polygon points="0 0,9 4.5,0 9" fill={color} />
            </marker>
            <filter id={`gw-${id}`}>
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id={`sg-${id}`}>
              <feGaussianBlur stdDeviation="2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width="370" height="270" fill="#0A0A14" />

          {/* Oral cavity */}
          <path
            d="M 100,100 Q 200,72 312,100 Q 322,148 314,202 Q 260,228 195,230 Q 140,228 108,208 Q 88,188 88,148 Q 88,118 100,100 Z"
            fill="#0F0A12"
          />

          {/* Hard palate */}
          <path d="M 100,100 Q 200,74 312,100" fill="none" stroke="#333350" strokeWidth="4" strokeLinecap="round" />

          {/* Alveolar ridge bump */}
          <path d="M 100,100 Q 108,90 118,96" fill="none" stroke="#444468" strokeWidth="3.5" strokeLinecap="round" />

          {/* Soft palate */}
          <path
            d={d.softPalate || 'M 312,100 Q 320,126 316,152 Q 314,166 310,176'}
            fill="none"
            stroke="#252540"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Floor of mouth */}
          <path d="M 108,208 Q 200,230 314,202" fill="none" stroke="#252540" strokeWidth="3" strokeLinecap="round" />

          {/* Throat back wall */}
          <path d="M 312,100 Q 326,148 320,232" fill="none" stroke="#1C1C34" strokeWidth="2.5" />

          {/* Upper jaw */}
          <rect x="70" y="88" width="38" height="10" rx="3" fill="#5A2030" />

          {/* Upper teeth */}
          {[
            [70, 98, 10, 18],
            [82, 96, 11, 20],
            [95, 95, 11, 21],
          ].map(([x, y, w, h], i) => (
            <rect key={`u${i}`} x={x} y={y} width={w} height={h} rx={2.5} fill="#C8C8D8" stroke="#D8D8E8" strokeWidth="0.8" />
          ))}

          {/* Lower jaw */}
          <rect x="70" y="186" width="38" height="10" rx="3" fill="#5A2030" />

          {/* Lower teeth */}
          {[
            [70, 168, 10, 17],
            [82, 168, 11, 18],
            [95, 169, 11, 17],
          ].map(([x, y, w, h], i) => (
            <rect key={`l${i}`} x={x} y={y} width={w} height={h} rx={2.5} fill="#C8C8D8" stroke="#D8D8E8" strokeWidth="0.8" />
          ))}

          {/* Lips */}
          <path d="M 50,100 Q 60,88 72,94 Q 80,98 90,100" fill="none" stroke="#6B2828" strokeWidth="5" strokeLinecap="round" />
          <path d="M 50,100 Q 58,110 70,112 Q 78,112 90,110" fill="none" stroke="#6B2828" strokeWidth="5" strokeLinecap="round" />
          <path d="M 50,100 Q 42,138 50,175" fill="none" stroke="#6B2828" strokeWidth="5" strokeLinecap="round" />
          <path d="M 50,175 Q 60,186 72,183 Q 80,181 90,179" fill="none" stroke="#6B2828" strokeWidth="5" strokeLinecap="round" />
          <path d="M 50,175 Q 58,166 70,164 Q 78,163 90,165" fill="none" stroke="#6B2828" strokeWidth="5" strokeLinecap="round" />

          {/* Nasal passage hint (subtle) */}
          <path d="M 100,100 Q 190,68 308,100" fill="none" stroke="#141424" strokeWidth="1" strokeDasharray="3,6" />

          {/* ── TONGUE ── */}
          <path
            d={d.tongue}
            fill={`${color}30`}
            stroke={color}
            strokeWidth="3"
            strokeLinejoin="round"
            filter={`url(#sg-${id})`}
          />

          {/* Tongue shape label (inside, subtle) */}
          <text x="215" y="174" textAnchor="middle" fontSize="12" fontWeight="700" fill={color} fontFamily="Arial,sans-serif" opacity="0.4">
            {d.shapeNote}
          </text>

          {/* Tip glow + dot */}
          <circle cx={d.tipX} cy={d.tipY} r="10" fill={color} opacity="0.15" filter={`url(#gw-${id})`} />
          <circle cx={d.tipX} cy={d.tipY} r="5" fill={color} opacity="0.95" />

          {/* Tip callout line + label */}
          <line
            x1={d.tipX + 6}
            y1={d.tipY - 4}
            x2={d.tipLabelX - 4}
            y2={d.tipLabelY + 3}
            stroke={color}
            strokeWidth="1"
            opacity="0.4"
          />
          <text x={d.tipLabelX} y={d.tipLabelY} fontSize="12" fontWeight="700" fill={color} fontFamily="Arial,sans-serif" opacity="0.85">
            {d.tipLabel}
          </text>

          {/* Air flow arrows */}
          {d.airArrows(color, id)}

          {/* Bottom air label pill */}
          <rect x="110" y="246" width="150" height="20" rx="10" fill={`${color}15`} stroke={`${color}25`} strokeWidth="1" />
          <text x="185" y="260" textAnchor="middle" fontSize="12" fontWeight="600" fill={color} fontFamily="Arial,sans-serif" opacity="0.8">
            {d.airLabel}
          </text>
        </svg>
      </div>

      {/* Feel tip */}
      <div
        className="rounded-xl p-3 text-xs leading-relaxed text-muted-foreground"
        style={{ backgroundColor: `${color}08`, border: `1px solid ${color}15` }}
      >
        <span className="font-semibold" style={{ color }}>
          Почувствуй:{' '}
        </span>
        {d.feel}
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-2.5">
        {d.steps.map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base"
              style={{ backgroundColor: `${color}12`, border: `1px solid ${color}20` }}
            >
              {step.icon}
            </div>
            <p className="pt-1.5 text-sm text-muted-foreground">{step.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
