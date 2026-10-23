import type { Entry } from './game-data';

// Owner-provided data absent from the public Notion catalog.
export const catalogSupplements: Entry[] = [
  // Pack references vanilla copper_chestplate; icon from Mojang/bedrock-samples. Effects provided by the owner.
  {
    id: 'armor_copper',
    name: '구리 갑옷',
    category: '갑옷',
    type: '갑옷',
    element: '어둠',
    rarity: '갑옷',
    icon: 'shield',
    description: '에너지 최대치 +160pt, 에너지 회복 효율 +30%',
    power: 0,
    team: 'D',
    counts: [0, 0, 0, 0, 0, 0, 0],
    imageUrl: '/game-assets/armor/copper-chestplate.png',
  },
];
