import type { Entry } from './game-data';
import type { EntryDetail } from './entry-details';

// Dungeon facts provided by the owner and the in-game entry screen.
export const dungeonEntries: Entry[] = [
  {
    id: 'dungeon_chicken_farm',
    name: '닭농장',
    category: '던전',
    type: '웨이브 던전',
    element: '무속성',
    rarity: '던전',
    icon: 'castle',
    description: '최소 입장 명성 20레벨. 총 3웨이브에 걸쳐 웨이브당 20레벨 닭 12마리, 총 36마리가 등장합니다.',
    power: 0,
    team: 'D',
    counts: [0, 0, 0, 0, 0, 0, 0],
    tagline: '꼬끼오~! 꼬꼬!',
  },
  {
    id: 'dungeon_gloomy_cave',
    name: '음침한 동굴',
    category: '던전',
    type: '웨이브 던전',
    element: '어둠',
    rarity: '던전',
    icon: 'castle',
    description: '최소 입장 명성 1레벨. 총 3웨이브로 진행되며 좀비와 뮤턴트 좀비가 등장합니다.',
    power: 0,
    team: 'D',
    counts: [0, 0, 0, 0, 0, 0, 0],
    tagline: '오우.. 꽤 으스스한걸요?',
  },
];

export const dungeonDetails: Record<string, EntryDetail> = {
  dungeon_chicken_farm: {
    sourceUrl: '',
    checkedOn: '2026-10-24',
    stats: [
      '권장 명성 / 최소 입장 명성: 20레벨',
      '평균 레벨: 20',
      '등장 몬스터: 20레벨 닭',
      '최대 인원: 8명',
      '추천 속성: 무속성',
      '총 웨이브: 3',
      '웨이브당 닭: 12마리 · 총 36마리',
      '입장 시간: 13:00~15:00 / 20:00~23:00',
      '극한 도전 불가',
    ],
    abilities: [
      { name: '1웨이브', description: '등장 몬스터: 닭 · 20레벨 · 12마리' },
      { name: '2웨이브', description: '등장 몬스터: 닭 · 20레벨 · 12마리' },
      { name: '3웨이브', description: '등장 몬스터: 닭 · 20레벨 · 12마리' },
    ],
  },
  dungeon_gloomy_cave: {
    sourceUrl: '',
    checkedOn: '2026-10-24',
    stats: [
      '권장 명성 / 최소 입장 명성: 1레벨',
      '평균 레벨: 3',
      '등장 몬스터: 좀비, 뮤턴트 좀비',
      '최대 인원: 6명',
      '추천 속성: 어둠',
      '총 웨이브: 3',
      '극한 도전 불가',
    ],
    abilities: [
      { name: '1웨이브', description: '등장 몬스터: 좀비 · 1레벨' },
      { name: '2웨이브', description: '좀비 · 3레벨 · 2마리\n좀비 · 5레벨 · 1마리' },
      { name: '3웨이브', description: '좀비 · 3레벨 · 2마리\n좀비 · 4레벨 · 1마리\n뮤턴트 좀비 · 3레벨 · 1마리' },
    ],
  },
};
