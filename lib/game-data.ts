export const TIERS = ['S', 'A', 'B', 'C', 'D'] as const;
export type Tier = typeof TIERS[number];
export const VERSIONS = ['1.6', '1.5', '1.4'];
export type Category = '무기' | '직업' | '유물' | '던전';
export type Entry = { id: string; name: string; category: Category; type: string; element: string; rarity: string; icon: string; description: string; power: number; team: Tier; counts: number[]; imageUrl?: string; tagline?: string; revision?: number };
export const entries: Entry[] = [
  {id:'moonblade',name:'흑월검',category:'무기',type:'한손검',element:'암흑',rarity:'전설',icon:'sword',description:'빠른 연속 공격으로 월식 중첩을 쌓는 한손검. 긴 보스전에서 안정적인 지속 피해를 제공합니다.',power:1240,team:'S',counts:[168,76,18,5,3]},
  {id:'dawnstaff',name:'여명의 지팡이',category:'무기',type:'지팡이',element:'빛',rarity:'전설',icon:'wand',description:'빛의 파동으로 넓은 범위의 적을 공격합니다. 시전 시간을 확보할 수 있는 조합과 잘 어울립니다.',power:1180,team:'S',counts:[145,82,24,6,3]},
  {id:'abyss',name:'심연의 대검',category:'무기',type:'대검',element:'암흑',rarity:'전설',icon:'swords',description:'묵직한 일격과 높은 경직 수치가 특징입니다. 공격 후 빈틈을 고려한 회피 운용이 필요합니다.',power:1560,team:'A',counts:[62,151,49,12,6]},
  {id:'frostbow',name:'서리꽃 활',category:'무기',type:'활',element:'냉기',rarity:'영웅',icon:'bow',description:'냉기 화살로 적의 이동을 늦춥니다. 안전한 거리에서 공격하는 초반 성장용 무기입니다.',power:1040,team:'A',counts:[43,109,51,12,5]},
  {id:'ember',name:'잿불의 창',category:'무기',type:'창',element:'화염',rarity:'영웅',icon:'flame',description:'관통 공격과 화상으로 일렬로 배치된 적을 상대합니다. 위치 선정에 따라 성능이 달라집니다.',power:1120,team:'B',counts:[20,48,87,16,9]},
  {id:'storm',name:'폭풍 쌍검',category:'무기',type:'쌍검',element:'번개',rarity:'전설',icon:'zap',description:'회피 직후 공격 속도가 증가합니다. 짧은 공격 기회를 활용하는 숙련자용 무기입니다.',power:980,team:'A',counts:[55,95,33,12,5]},
  {id:'stone',name:'수호자의 망치',category:'무기',type:'망치',element:'대지',rarity:'희귀',icon:'hammer',description:'방어에 특화된 망치. 생존력은 높지만 빠른 공략에는 다소 불리합니다.',power:860,team:'C',counts:[3,12,33,62,20]},
  {id:'training',name:'낡은 수련검',category:'무기',type:'한손검',element:'무속성',rarity:'일반',icon:'sword',description:'기본 조작을 익히는 수련용 검입니다. 성장 후에는 상위 장비로 교체하는 편이 좋습니다.',power:180,team:'D',counts:[1,2,8,29,70]},
  {id:'knight',name:'월광 기사',category:'직업',type:'근접 · 방어',element:'빛',rarity:'직업',icon:'shield',description:'방패와 검을 함께 사용하며 아군을 보호하는 근접 직업입니다.',power:920,team:'A',counts:[43,74,25,6,2]},
  {id:'mage',name:'원소술사',category:'직업',type:'원거리 · 마법',element:'화염',rarity:'직업',icon:'wand',description:'원소 주문을 연계해 넓은 범위에 피해를 주는 마법 직업입니다.',power:1100,team:'S',counts:[80,40,12,5,3]},
  {id:'relic',name:'별빛의 나침반',category:'유물',type:'보조 · 치명타',element:'빛',rarity:'전설',icon:'compass',description:'치명타 기반 빌드에 어울리는 보조 유물입니다. 다른 치명타 장비와 함께 사용하세요.',power:12,team:'A',counts:[20,49,17,3,1]},
  {id:'heart',name:'불멸의 심장',category:'유물',type:'생존 · 회복',element:'화염',rarity:'영웅',icon:'heart',description:'위기 상황에서 생존을 돕는 회복 유물. 공격보다 안정성을 우선할 때 선택합니다.',power:8,team:'B',counts:[10,19,35,12,4]},
  {id:'tower',name:'절망의 탑',category:'던전',type:'도전 · 30층',element:'암흑',rarity:'도전',icon:'castle',description:'층마다 다른 적과 기믹이 등장합니다. 지속 전투를 위한 회복 수단을 준비하세요.',power:30,team:'A',counts:[25,44,20,8,3]},
  {id:'forest',name:'서리빛 숲',category:'던전',type:'탐험 · 입문',element:'냉기',rarity:'입문',icon:'tree',description:'냉기 상태 이상을 경험하는 입문 던전. 원거리 적부터 처리하면 수월합니다.',power:10,team:'B',counts:[8,20,32,8,2]},
];
export const guides = [
 {id:'start',tag:'입문 가이드',title:'처음 시작하는 모험가를 위한 성장 루트',desc:'장비 선택부터 첫 던전까지, 막힘없이 시작하기',author:'루미너스 공략팀',time:'8분',likes:128,icon:'compass',body:['처음에는 높은 등급보다 자신의 조작 방식에 맞는 무기를 골라보세요. 서리꽃 활은 거리를 유지하며 기본 전투를 익히기에 좋은 선택입니다.','서리빛 숲에서 회피와 적의 공격 예고를 연습하세요. 재화를 한 번에 사용하기보다 무기와 생존 장비에 나누어 투자하는 흐름을 권합니다.','성장이 끝나면 보스전과 던전용 장비를 구분해 보세요. 티어표는 출발점이며, 플레이 스타일에 따라 선택은 달라집니다.']},
 {id:'moon',tag:'무기 분석',title:'흑월검, 중첩을 유지하는 것이 핵심',desc:'보스전 운용과 함께 쓰기 좋은 유물',author:'새벽',time:'5분',likes:86,icon:'sword',body:['흑월검은 연속 공격을 통해 중첩을 쌓는 무기입니다. 짧은 공격 기회에도 중첩을 유지하는 운용을 연습하세요.','별빛의 나침반처럼 치명타를 보조하는 유물과 조합할 수 있습니다. 생존이 어렵다면 불멸의 심장으로 교체해 안정성을 높여보세요.','무리한 추가 공격보다 회피를 먼저 확보하세요. 무기 특성과 추천 조합을 기준으로 운용법을 정리했습니다.']},
 {id:'tower',tag:'던전 공략',title:'절망의 탑 30층 준비 체크리스트',desc:'도전 전 확인할 생존력과 패턴 대응',author:'공략팀 · 리아',time:'6분',likes:64,icon:'castle',body:['장기전에 대비해 회복 수단과 상태 이상 대응 장비를 준비합니다.','위험한 공격 이후 생기는 짧은 빈틈에 피해를 집중하세요. 대검처럼 후딜레이가 긴 무기는 특히 신중한 판단이 필요합니다.','실패한 구간을 기록하고 무기나 유물을 하나씩 바꾸며 비교해 보세요. 반복 도전에서는 실패 구간과 장비 변경 결과를 함께 기록하세요.']},
];
export function baseCounts(e: Entry, version: string) { const shift=VERSIONS.indexOf(version); return e.counts.map((v,i)=>Math.max(0,Math.round(v*(1-shift*.18)+(i>1?shift*8:-shift*3)))); }
export function stats(counts: number[]) {const total=counts.reduce((a,b)=>a+b,0); const average=total?counts.reduce((a,b,i)=>a+b*(5-i),0)/total:0; const variance=total?counts.reduce((a,b,i)=>a+b*((5-i)-average)**2,0)/total:0; return {total,average,agreement:total?Math.round(100*(1-Math.sqrt(variance)/2)):0,tier:(average>=4.5?'S':average>=3.5?'A':average>=2.5?'B':average>=1.5?'C':'D') as Tier}; }
