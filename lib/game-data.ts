import { notionArmor } from './notion-armor';
import { notionItems } from './notion-items';
import { notionJobs } from './notion-jobs';

export const TIERS = ['S', 'A', 'B+', 'B', 'C', 'D', 'F'] as const;
export type GameMode = 'PVE' | 'PVP';
export type Tier = typeof TIERS[number];
export const TIER_SCORES: Record<Tier, number> = { S: 5, A: 4, 'B+': 3.5, B: 3, C: 2, D: 1, F: 0 };
export const TIER_THRESHOLDS: Record<Tier, number> = { S: 4.5, A: 3.75, 'B+': 3.25, B: 2.5, C: 1.5, D: 0.5, F: 0 };
export const TIER_RANGES: Record<Tier, string> = { S: '4.50+', A: '3.75+', 'B+': '3.25+', B: '2.50+', C: '1.50+', D: '0.50+', F: '< 0.50' };
export const tierClass = (tier: string) => tier === 'B+' ? 'B-plus' : tier;
export const emptyCounts = () => TIERS.map(() => 0);

export const VERSIONS = ['26-09-30'];
export type Category = '무기' | '직업' | '유물' | '갑옷' | '던전';

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
  ...notionArmor,
];
export const guides: Guide[] = [];

export function baseCounts(entry: Entry, _version: string) {
  // Existing catalog data uses the original S/A/B/C/D order.
  return entry.counts.length === 5
    ? [entry.counts[0], entry.counts[1], 0, entry.counts[2], entry.counts[3], entry.counts[4], 0]
    : [...entry.counts];
}

export function stats(counts: number[]) {
  const total = counts.reduce((sum, count) => sum + count, 0);
  const average = total
    ? counts.reduce((sum, count, index) => sum + count * TIER_SCORES[TIERS[index]], 0) / total
    : 0;
  const variance = total
    ? counts.reduce((sum, count, index) => sum + count * (TIER_SCORES[TIERS[index]] - average) ** 2, 0) / total
    : 0;

  return {
    total,
    average,
    agreement: total ? Math.round(100 * (1 - Math.sqrt(variance) / 2.5)) : 0,
    tier: TIERS.find(tier => average >= TIER_THRESHOLDS[tier]) || 'F',
  };
}

