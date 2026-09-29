export const TIERS = ['S', 'A', 'B', 'C', 'D'] as const;
export type Tier = typeof TIERS[number];

export const VERSIONS = ['1.0'];
export type Category = '무기' | '직업' | '유물' | '던전';

export type Entry = {
  id: string;
  name: string;
  category: Category;
  type: string;
  element: string;
  rarity: string;
  icon: string;
  description: string;
  power: number;
  team: Tier;
  counts: number[];
  imageUrl?: string;
  tagline?: string;
  revision?: number;
};

export type Guide = {
  id: string;
  tag: string;
  title: string;
  desc: string;
  author: string;
  time: string;
  likes: number;
  icon: string;
  body: string[];
};

// 실제 운영 데이터는 관리자가 검증한 뒤 이 배열에 추가합니다.
export const entries: Entry[] = [
    {
    id: 'warrior_1',
    name: '사냥꾼',
    category: '직업',
    type: '공격력 · 둔화 ',
    element: '무속성',
    rarity: '직업',
    icon: 'sword',
    description: '고유기로 강한 데미지와 둔화를 부여하는 직업입니다.',
    power: 0,
    team: 'A',
    counts: [0, 0, 0, 0, 0],
  },
    {
    id: 'warrior_2',
    name: '난투사',
    category: '직업',
    type: '반사 · 피해 감소 ',
    element: '무속성',
    rarity: '직업',
    icon: 'sword',
    description: '고유기로 데미지를 경감시키고, 경감된 피해를 반사시키는 직업입니다.',
    power: 0,
    team: 'A',
    counts: [0, 0, 0, 0, 0],
  },
    {
    id: 'warrior_3',
    name: '검객',
    category: '직업',
    type: '공격력 · 치명타 ',
    element: '무속성',
    rarity: '직업',
    icon: 'sword',
    description: '고유기의 검기로 데미지를 입히고, 자신의 치명타 확률을 증가시키는 직업입니다.',
    power: 0,
    team: 'A',
    counts: [0, 0, 0, 0, 0],
  },
    {
    id: 'warrior_4',
    name: '돌격병',
    category: '직업',
    type: '공격력 · 상태이상 ',
    element: '무속성',
    rarity: '직업',
    icon: 'sword',
    description: '고유기로 이동하며, 적에게 에어본을 누적하는 직업입니다.',
    power: 0,
    team: 'A',
    counts: [0, 0, 0, 0, 0],
  },
];
export const guides: Guide[] = [];

export function baseCounts(entry: Entry, _version: string) {
  return [...entry.counts];
}

export function stats(counts: number[]) {
  const total = counts.reduce((sum, count) => sum + count, 0);
  const average = total
    ? counts.reduce((sum, count, index) => sum + count * (5 - index), 0) / total
    : 0;
  const variance = total
    ? counts.reduce((sum, count, index) => sum + count * ((5 - index) - average) ** 2, 0) / total
    : 0;

  return {
    total,
    average,
    agreement: total ? Math.round(100 * (1 - Math.sqrt(variance) / 2)) : 0,
    tier: (average >= 4.5 ? 'S' : average >= 3.5 ? 'A' : average >= 2.5 ? 'B' : average >= 1.5 ? 'C' : 'D') as Tier,
  };
}

