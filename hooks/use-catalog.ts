'use client';

import { entries } from '@/lib/game-data';

export function useCatalog() {
  return {
    entries,
    isAdmin: false,
    error: '',
    refresh: async () => {},
    update: (_entry: unknown) => {},
  };
}
