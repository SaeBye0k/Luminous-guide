import { notionItems } from './notion-items';
import { notionJobs } from './notion-jobs';

export const TIERS = ['S', 'A', 'B', 'C', 'D'] as const;
export type Tier = typeof TIERS[number];

export const VERSIONS = ['26-09-30'];
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
  ...notionJobs,
  ...notionItems,
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

