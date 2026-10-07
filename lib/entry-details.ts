export type Ability = {name:string;description:string;notes?:string[]};
export type EntryDetail = {sourceUrl:string;checkedOn:string;stats:string[];abilities:Ability[];transcend?:Ability[]};

// Verified public Notion text; effects are listed individually, not accumulated.
export const entryDetails:Record<string,EntryDetail> = {
  notion_c38343c5f5d54bd988b251f45e5d7812: {
    sourceUrl:'https://luminous-rpg.notion.site/c38343c5f5d54bd988b251f45e5d7812', checkedOn:'2026-10-07',
    stats:['기초 공격력 +6'],
    abilities:[{name:'일반 공격 — 압도',description:'1~2) 검을 휘둘러서 앞에 있는 적들을 밀어내고 공격력 70%의 근접 피해를 가합니다.\n3) 가까운 적에게 달려가 검으로 찔러서 공격력 320%의 근접 피해를 가합니다.',notes:['피격 대상: 1~2','피격 범위: 4칸']}],
    transcend:[{name:'성장',description:'공격력이 50% 증가합니다.'},{name:'절대 방어',description:'80%의 확률로 입는 원거리 피해를 무시하고 다음 일반 공격이 즉시 3타를 발동합니다.'},{name:'콤보',description:'공중에 떠 있는 적에게 가하는 피해가 100% 증가합니다.'}],
  },
  'job_전사_1': {
    sourceUrl:'https://luminous-rpg.notion.site/227f741d045e801988d0da50f9b5ac82', checkedOn:'2026-10-07',stats:['전수: 기초 직업 훈련소'],
    abilities:[{name:'고유기 — 호시탐탐',description:'가장 가까운 적의 머리를 내리쳐서 공격력 460%의 피해를 가하고 이동 속도를 1s 동안 40% 감소시킵니다.',notes:['재사용 대기시간: 2s']}],
  },
  notion_3ebf741d045e806fb083dd7a781cbf2f: {
    sourceUrl:'https://luminous-rpg.notion.site/3ebf741d045e806fb083dd7a781cbf2f',checkedOn:'2026-10-07',stats:['기초 희귀도 +10','내구도 200'],
    abilities:[{name:'스킬 — 금덩이다!',description:'이 유물을 들고 유물의 레벨보다 평균 레벨이 낮은 던전 진입시 기존 획득 확률이 10% 이하인 전리품중 1개의 획득 확률이 기존 드랍 확률의 1.5배 만큼 상승합니다.\n이 효과는 조건을 만족하는 던전 진입시 발동으로 간주하며 발동시 내구도가 10 감소합니다.'}],
    transcend:[{name:'얍삽',description:'내구도가 10 증가합니다.'},{name:'욕구',description:'드랍 확률 증가량이 1.5배에서 1.7배로 증가합니다.'},{name:'도전',description:'이 유물의 레벨이 10레벨 더 높다고 간주합니다.'}],
  },
};
