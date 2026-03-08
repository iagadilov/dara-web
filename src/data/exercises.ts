export type SoundId = 's' | 'sh' | 'l' | 'r' | 'n' | 'z';

export type Exercise = {
  id: string;
  soundId: SoundId;
  type: 'warmup' | 'articulation' | 'tongue_twister' | 'reading';
  title: string;
  duration: number;
  instruction: string;
  steps: string[];
  tonguePosition: string;
  expectedText?: string;
};

export const SOUND_COLORS: Record<SoundId, string> = {
  s: '#4ECDC4',
  sh: '#FFD93D',
  l: '#A8E6CF',
  r: '#FF8B94',
  n: '#C9B1FF',
  z: '#74B9FF',
};

export const EXERCISES: Exercise[] = [
  // РАЗМИНКА
  {
    id: 'warmup-1',
    soundId: 's',
    type: 'warmup',
    title: 'Жевание',
    duration: 20,
    instruction: 'Имитируй жевание жвачки — активируй мышцы рта',
    steps: ['Медленно жуй воображаемую жвачку', 'Движения должны быть преувеличенными'],
    tonguePosition: 'relaxed',
  },
  {
    id: 'warmup-2',
    soundId: 's',
    type: 'warmup',
    title: 'Зевок',
    duration: 15,
    instruction: 'Широко зевни 3 раза — расслабляет горло',
    steps: ['Открой рот максимально широко', 'Потяни зевок как можно дольше', 'Повтори 3 раза'],
    tonguePosition: 'relaxed',
  },
  {
    id: 'warmup-3',
    soundId: 's',
    type: 'warmup',
    title: 'Губы: трубочка → улыбка',
    duration: 30,
    instruction: 'Чередуй позиции губ 10 раз',
    steps: ['Вытяни губы трубочкой вперёд', 'Резко растяни в широкую улыбку', 'Повтори 10 раз быстро'],
    tonguePosition: 'relaxed',
  },

  // ЗВУК С
  {
    id: 's-1',
    soundId: 's',
    type: 'articulation',
    title: 'Постановка С',
    duration: 60,
    instruction: 'Отрабатывай правильное положение языка для звука С',
    steps: [
      'Улыбнись — зубы видны, почти сомкнуты',
      'Кончик языка упри в нижние зубы изнутри',
      'Выдыхай тонкую холодную струю по центру',
      'Повторяй: са-со-су-сы-си',
    ],
    tonguePosition: 'кончик языка у нижних зубов, язык плоский, холодная узкая струя по центру',
    expectedText: 'са со су сы си',
  },
  {
    id: 's-2',
    soundId: 's',
    type: 'tongue_twister',
    title: 'Скороговорка: Саша',
    duration: 90,
    instruction: 'Шла Саша по шоссе и сосала сушку',
    steps: [
      'Медленно: чётко каждый звук',
      'Быстро: не теряй чёткость',
      'Громко: усиль артикуляцию',
      'Тихо: но чётко',
    ],
    tonguePosition: 'чередование С и Ш, следи за переключением',
    expectedText: 'Шла Саша по шоссе и сосала сушку',
  },

  // ЗВУК Ш
  {
    id: 'sh-1',
    soundId: 'sh',
    type: 'articulation',
    title: 'Постановка Ш',
    duration: 60,
    instruction: 'Язык как ложка — кончик вверх, тёплая струя',
    steps: [
      'Округли губы и чуть выдвинь вперёд',
      'Подними язык вверх — форма ложки',
      'Выдыхай тёплую широкую струю вперёд',
      'Повторяй: ша-шо-шу-ши',
    ],
    tonguePosition: 'кончик языка поднят к нёбу, язык в форме ложки, тёплая широкая струя',
    expectedText: 'ша шо шу ши',
  },
  {
    id: 'sh-2',
    soundId: 'sh',
    type: 'tongue_twister',
    title: 'Скороговорка: Мышка',
    duration: 90,
    instruction: 'Мышка шуршит в шалаше',
    steps: ['Медленно', 'Быстро', 'Громко', 'Тихо'],
    tonguePosition: 'звук Ш: язык-ложка вверх, тёплая струя',
    expectedText: 'Мышка шуршит в шалаше',
  },

  // ЗВУК Л
  {
    id: 'l-1',
    soundId: 'l',
    type: 'articulation',
    title: 'Постановка Л',
    duration: 60,
    instruction: 'Кончик касается верхних зубов, воздух по бокам',
    steps: [
      'Кончик языка упри в верхние зубы изнутри',
      'Края языка опущены — воздух идёт по бокам',
      'Повторяй: ла-ло-лу-ли-ля',
    ],
    tonguePosition: 'кончик языка у верхних зубов, края языка опущены, воздух по бокам',
    expectedText: 'ла ло лу ли ля',
  },
  {
    id: 'l-2',
    soundId: 'l',
    type: 'tongue_twister',
    title: 'Скороговорка: Лола',
    duration: 90,
    instruction: 'Клала Лола лилии в люльку',
    steps: ['Медленно', 'Быстро', 'Громко', 'Тихо'],
    tonguePosition: 'звук Л: кончик у верхних зубов, воздух по бокам',
    expectedText: 'Клала Лола лилии в люльку',
  },

  // ЗВУК Р
  {
    id: 'r-1',
    soundId: 'r',
    type: 'articulation',
    title: 'Постановка Р',
    duration: 90,
    instruction: 'Кончик у нёба — сильная струя вызывает вибрацию',
    steps: [
      'Подними кончик к нёбу сразу за верхними зубами',
      'Выдыхай сильную струю — кончик начнёт дрожать',
      'Тренировка: д-д-д-дрр (очень быстро)',
      'Переходи к: дра-дро-дру',
    ],
    tonguePosition: 'кончик языка у альвеол за верхними зубами, вибрирует от сильной воздушной струи',
    expectedText: 'дра дро дру три дроворуба',
  },
  {
    id: 'r-2',
    soundId: 'r',
    type: 'tongue_twister',
    title: 'Скороговорка: Дроворубы',
    duration: 90,
    instruction: 'Три дроворуба рубили дрова',
    steps: ['Медленно', 'Быстро', 'Громко', 'Тихо'],
    tonguePosition: 'звук Р: кончик вибрирует у альвеол',
    expectedText: 'Три дроворуба рубили дрова',
  },

  // ЗВУК Н
  {
    id: 'n-1',
    soundId: 'n',
    type: 'articulation',
    title: 'Постановка Н',
    duration: 60,
    instruction: 'Язык — пробка, воздух через нос',
    steps: [
      'Язык плотно прижат к верхним зубам',
      'Весь воздух идёт через нос',
      'Прижми пальцы к носу — должен чувствоваться гул',
      'Повторяй: на-но-ну-ни-ня',
    ],
    tonguePosition: 'кончик языка у верхних зубов, полная смычка, воздух через нос, нёбная занавеска опущена',
    expectedText: 'на но ну ни ня',
  },

  // ЗВУК З
  {
    id: 'z-1',
    soundId: 'z',
    type: 'articulation',
    title: 'Постановка З',
    duration: 60,
    instruction: 'Как С — но горло гудит',
    steps: [
      'Позиция языка и губ — как при С',
      'Добавь голос: горло должно гудеть',
      'Проверь рукой: рука на горле — С (тихо) → З (вибрация)',
      'Повторяй: за-зо-зу-зи-зя',
    ],
    tonguePosition: 'как С: кончик у нижних зубов, плоский язык, но голосовые связки вибрируют',
    expectedText: 'за зо зу зи зя',
  },
];
