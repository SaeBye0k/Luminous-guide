import type { Entry } from './game-data';

const jobGroups = {
  전사: ['사냥꾼','난투사','검객','돌격병','검무사','기동사','투지자','성검사','칼리우드','검주','숙련자','루인','링커'],
  수호자: ['가디언','철인','역전자','철혈기사','철의 거인','양치기','방패 용사','대리 기사','채무 부여자','유도자','선포자','가람','빙갑사','대리인'],
  저격수: ['궁수','요격대','매복자','추방자','마탄의 사수','광란의 사수','하늘의 사도','서리꾼'],
  지원가: ['회복술사','제육볶이','소음꾼','대식가','요리사','8282','텔레포터','비바라기','브라보','아티스타'],
  공통: ['농부','낚시꾼','풍압술사','도박꾼','광부'],
} as const;

const classIcons:Record<keyof typeof jobGroups,string>={전사:'sword',수호자:'shield',저격수:'bow',지원가:'heart',공통:'compass'};

const jobElements:Record<string,string>={
  칼리우드:'대지',
  선포자:'대지',
};

export const notionJobs:Entry[]=Object.entries(jobGroups).flatMap(([jobClass,names])=>
  names.map((name,index)=>({
    id:`job_${jobClass}_${index+1}`,
    name,
    category:'직업' as const,
    type:`${jobClass} 계열`,
    element:jobElements[name] ?? '무속성',
    rarity:'직업',
    icon:classIcons[jobClass as keyof typeof jobGroups],
    description:`${jobClass} 클래스에서 선택할 수 있는 직업입니다.`,
    power:0,
    team:'D' as const,
    counts:[0,0,0,0,0],
  }))
);
