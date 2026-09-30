export type JobTrait = {id:string;description:string};
export const jobTraits:Record<string,{sourceUrl:string;traits:JobTrait[]}> = {
  "8282": {
    "sourceUrl": "https://luminous-rpg.notion.site/39ef741d045e80e6a3d7ce44237c630b",
    "traits": [
      {
        "id": "trait_3e6f741d045e81dc9c43edc52d0df5fe",
        "description": "소모한 체력만큼 [유대의 사슬]이 연결된 아군을 회복"
      },
      {
        "id": "trait_3e6f741d045e81a5bf39f85eaf38bdc7",
        "description": "체력 +30%"
      },
      {
        "id": "trait_3e6f741d045e817d8001cd3fca34b1f4",
        "description": "체력 소모 20%, 쿨타임 감소 50%"
      },
      {
        "id": "trait_3e6f741d045e81129fb5e5062a06a169",
        "description": "[유대의 사슬]이 없는 아군도 유물 쿨타임 15% 감소"
      },
      {
        "id": "trait_3e6f741d045e810598b6f91a18ee03b7",
        "description": "체력 소모 제거, 쿨타임 감소 15%"
      },
      {
        "id": "trait_3e6f741d045e8144b8faf6c34e5f70e4",
        "description": "범위가 15칸으로 증가하고 범위 내 아군 이동 속도 15% 증가"
      }
    ]
  },
  "사냥꾼": {
    "sourceUrl": "https://luminous-rpg.notion.site/227f741d045e801988d0da50f9b5ac82",
    "traits": [
      {
        "id": "trait_3e6f741d045e8109947ec8b98f1a443e",
        "description": "모든 피해량 +15%"
      },
      {
        "id": "trait_3e6f741d045e818c9114d183603b04cf",
        "description": "고유기로 가하는 피해에 치명타 적용"
      },
      {
        "id": "trait_3e6f741d045e813da500c87b9edca99e",
        "description": "고유기의 명중한 적의 받는 피해 3s 동안 +40%"
      },
      {
        "id": "trait_3e6f741d045e81ff9098c182df515e0e",
        "description": "고유기 명중시 궁극기 포인트 5pt 회복"
      },
      {
        "id": "trait_3e6f741d045e81aebb7ac082ffb50e13",
        "description": "고유기로 가하는 피해 +60%"
      },
      {
        "id": "trait_3e6f741d045e8119b120dc51be4b94a9",
        "description": "궁극기 발동시 주변 15칸 내의 적들에게 공격력 1000%의 피해 주기"
      }
    ]
  },
  "난투사": {
    "sourceUrl": "https://luminous-rpg.notion.site/171f741d045e8055a4eef339ec7273b6",
    "traits": [
      {
        "id": "trait_3e6f741d045e81cf950decd3f15a038f",
        "description": "고유기로 가하는 피해에 치명타 적용"
      },
      {
        "id": "trait_3e6f741d045e819e808bc92f6bf2bf70",
        "description": "궁극기 사용시 지속시간 동안 치명타 피해 +100%"
      },
      {
        "id": "trait_3e6f741d045e81b1b1a8c513acdd5d6e",
        "description": "고유기 명중시 궁극기 포인트 10pt 회복"
      },
      {
        "id": "trait_3e6f741d045e81839137c8886ecddbc5",
        "description": "장검으로 가하는 피해 +45%"
      },
      {
        "id": "trait_3e6f741d045e81c09935c5754ed7902b",
        "description": "근접 피해 +15%"
      },
      {
        "id": "trait_3e6f741d045e81aca0abd448105b3dc4",
        "description": "고유기의 피해 경감이 99%로 증가"
      }
    ]
  },
  "검객": {
    "sourceUrl": "https://luminous-rpg.notion.site/171f741d045e808fbf0be229cfd69b68",
    "traits": [
      {
        "id": "trait_3e6f741d045e81009486c42253498c29",
        "description": "고유기로 가하는 피해가 피해를 입는 적들의 수당 15%씩 증가"
      },
      {
        "id": "trait_3e6f741d045e818b8420d88ef4ce6637",
        "description": "치명타 확률 +15%"
      },
      {
        "id": "trait_3e6f741d045e816c9074fe9e691bc006",
        "description": "치명타 피해 +10%"
      },
      {
        "id": "trait_3e6f741d045e8172a259c426f3def342",
        "description": "궁극기 사용시 지속시간 동안 고유기 대기시간 2s로 변경"
      },
      {
        "id": "trait_3e6f741d045e81bf9538ca708ab74331",
        "description": "고유기로 가하는 피해는 반드시 치명타 발동"
      },
      {
        "id": "trait_3e6f741d045e8108a3aacf0dde397d53",
        "description": "고유기로 받는 치명타 확률 버프가 100%, 지속시간 2s로 변경"
      }
    ]
  },
  "돌격병": {
    "sourceUrl": "https://luminous-rpg.notion.site/226f741d045e8022878bc72ba4490e9e",
    "traits": [
      {
        "id": "trait_3e6f741d045e81649535cc98b3d065cf",
        "description": "상태이상에 빠진 적에게 가하는 피해 +50%"
      },
      {
        "id": "trait_3e6f741d045e81eaab94e851a0148baf",
        "description": "상태이상 명중 +20%"
      },
      {
        "id": "trait_3e6f741d045e812ca5cbc7afbbb545d3",
        "description": "고유기 사용 시 궁극기 포인트 8pt 회복"
      },
      {
        "id": "trait_3e6f741d045e810786c7fe5376f54fe6",
        "description": "고유기 발동 도중 모든 피해와 넉백을 무시"
      },
      {
        "id": "trait_3e6f741d045e81b481d1ccf780c9c609",
        "description": "고유기로 가하는 피해 +200%"
      },
      {
        "id": "trait_3e6f741d045e812fba59d77987c878cc",
        "description": "궁극기 사용 시 상태이상 명중 +50%"
      }
    ]
  },
  "투지자": {
    "sourceUrl": "https://luminous-rpg.notion.site/3a5f741d045e80a29012c676b7918285",
    "traits": [
      {
        "id": "trait_3e6f741d045e811aa3f3c5fd2ade9c7e",
        "description": "에너지 회복효율 +25%"
      },
      {
        "id": "trait_3e6f741d045e81c68d4dfd231dc377ac",
        "description": "에너지 획득량 +15pt"
      },
      {
        "id": "trait_3e6f741d045e813e94c2c6564ae58f56",
        "description": "투지 스택 획득량 +1pt"
      },
      {
        "id": "trait_3e6f741d045e81df8ba5ef656b3d8530",
        "description": "공격력 +40%"
      },
      {
        "id": "trait_3e6f741d045e813e90fcf31f0030992e",
        "description": "궁극기 발동시 궁극기 포인트 +15pt"
      },
      {
        "id": "trait_3e6f741d045e811c9d43f45a14546e09",
        "description": "궁극기 포인트 획득량 +30pt"
      }
    ]
  },
  "성검사": {
    "sourceUrl": "https://luminous-rpg.notion.site/3a8f741d045e802e86fdd68d7680d5f8",
    "traits": [
      {
        "id": "trait_3e6f741d045e81d4bad1d3e8553310e8",
        "description": "공격력 +30%"
      },
      {
        "id": "trait_3e6f741d045e81959520eadd018349e7",
        "description": "연계 공격으로 가하는 피해 +30%"
      },
      {
        "id": "trait_3e6f741d045e813f8aeff2680720dff1",
        "description": "연계 공격 발동시 궁극기 포인트 5pt 회복"
      },
      {
        "id": "trait_3e6f741d045e81369e6bdef377873da4",
        "description": "[마력 수집] 상태에서 지속적으로 주변 적들 밀치기"
      },
      {
        "id": "trait_3e6f741d045e813699d2eeacbcb41128",
        "description": "고유기 발동시 궁극기 포인트 2pt 회복"
      },
      {
        "id": "trait_3e6f741d045e818886bfce72a5938f20",
        "description": "궁극기 발동시 즉시 궁극기 포인트 20pt 회복"
      }
    ]
  },
  "기동사": {
    "sourceUrl": "https://luminous-rpg.notion.site/3a5f741d045e8037a20cc98d1396474a",
    "traits": [
      {
        "id": "trait_3e6f741d045e81248876f8c6782c8084",
        "description": "공중에서 가하는 피해 +20%"
      },
      {
        "id": "trait_3e6f741d045e813698c6eea9ffeb46ce",
        "description": "공중에서 궁극기 발동 시 버프 효과 2배"
      },
      {
        "id": "trait_3e6f741d045e81eea25ac44649fdd00f",
        "description": "고유기 명중 시 에너지 5pt 회복"
      },
      {
        "id": "trait_3e6f741d045e8196aff8c757e217bf83",
        "description": "고유기에 명중한 적을 위로 넉백"
      },
      {
        "id": "trait_3e6f741d045e8166ac3dfaf15c12bf95",
        "description": "밧줄 사용 시 고유기 자동 발동 (재사용 대기시간 1s)"
      },
      {
        "id": "trait_3e6f741d045e8144abeec0ce2b6fbf19",
        "description": "고유기로 가하는 피해 +30%"
      }
    ]
  },
  "검무사": {
    "sourceUrl": "https://luminous-rpg.notion.site/39ff741d045e80509beddcaffeea53a0",
    "traits": [
      {
        "id": "trait_3e6f741d045e8120b62ff88b9b913dde",
        "description": "공격력 +20%"
      },
      {
        "id": "trait_3e6f741d045e811ea675e2bb9933f7be",
        "description": "검을 주울때마다 치명타 확률 +16%"
      },
      {
        "id": "trait_3e6f741d045e8159aad9c8ea42861513",
        "description": "검이 떨어져있다면 넉백 저항 +40%"
      },
      {
        "id": "trait_3e6f741d045e813f83b2ebc13fe40f9b",
        "description": "검이 떨어져있다면 이동속도 +5pt"
      },
      {
        "id": "trait_3e6f741d045e81ea8324e2c5369fe30f",
        "description": "검을 주울때마다 체력 10% 회복"
      },
      {
        "id": "trait_3e6f741d045e81f682d0dc93d3df45e7",
        "description": "검을 주울때마다 궁극기 포인트 5pt 회복"
      }
    ]
  },
  "숙련자": {
    "sourceUrl": "https://luminous-rpg.notion.site/3adf741d045e80dfa567fa7a3a592c62",
    "traits": [
      {
        "id": "trait_3e6f741d045e8160a446d52745b6fcce",
        "description": "발차기 치명타 확률 +5%"
      },
      {
        "id": "trait_3e6f741d045e8196bed1e0cd3336bb57",
        "description": "발차기 치명타 확률 +5%"
      },
      {
        "id": "trait_3e6f741d045e81228647cc82045b7917",
        "description": "발차기 치명타 피해 +10%"
      },
      {
        "id": "trait_3e6f741d045e81d9967fe7ef87f05b8e",
        "description": "발차기 명중시 주변 4칸 이내의 다른 적에게 40% 피해 확산"
      },
      {
        "id": "trait_3e6f741d045e81aebce2c5308109e206",
        "description": "발차기에 명중한 적 2s 동안 경직"
      },
      {
        "id": "trait_3e6f741d045e81baa4bbe8a65521f3e3",
        "description": "기술 피해 +40%"
      }
    ]
  },
  "루인": {
    "sourceUrl": "https://luminous-rpg.notion.site/3c1f741d045e80ff920ee900f7971536",
    "traits": [
      {
        "id": "trait_3e6f741d045e8136b17dddabd300aa5f",
        "description": "공격력 +30%"
      },
      {
        "id": "trait_3e6f741d045e81f39b25c0797386c33b",
        "description": "[낙인] 소멸시 재사용 대기시간 3s 감소"
      },
      {
        "id": "trait_3e6f741d045e81c2806ee360301be5c4",
        "description": "[낙인]이 남겨진 적의 방어력 10% 감소"
      },
      {
        "id": "trait_3e6f741d045e812aa58ff1379f4df715",
        "description": "고유기 사용 후 [낙인] 소멸 전까지 가하는 피해 +10%"
      },
      {
        "id": "trait_3e6f741d045e81af8e5bf625774f0716",
        "description": "침식 피해 +30%"
      },
      {
        "id": "trait_3e6f741d045e8128bce0e98025ef2006",
        "description": "[낙인]이 남겨진 적의 이동속도 10% 감소"
      }
    ]
  },
  "검주": {
    "sourceUrl": "https://luminous-rpg.notion.site/3abf741d045e80bfa17add8ca2075819",
    "traits": [
      {
        "id": "trait_3e6f741d045e816eaff6e4981cdbb4b9",
        "description": "공격력 +20%"
      },
      {
        "id": "trait_3e6f741d045e81ab8100d360f6f5471c",
        "description": "[검계]의 지속시간 8s로 변경"
      },
      {
        "id": "trait_3e6f741d045e813fa7cbc46c0d97901d",
        "description": "[검계] 내에서 사용중인 장비의 속성 피해 +24%"
      },
      {
        "id": "trait_3e6f741d045e81519e80c67c4c24206e",
        "description": "[검흔] 5스택인 적에게 피해를 입히면 [검계]의 지속시간 +0.2s"
      },
      {
        "id": "trait_3e6f741d045e81158ec2e3d7cf1e1287",
        "description": "[검계] 범위 내 적의 이동속도 30% 감소"
      },
      {
        "id": "trait_3e6f741d045e81508480edf2de583edf",
        "description": "이동속도 +10%"
      }
    ]
  },
  "칼리우드": {
    "sourceUrl": "https://luminous-rpg.notion.site/3adf741d045e808ba23af1ffa649f48b",
    "traits": [
      {
        "id": "trait_3e6f741d045e810382a6d476875b0ca5",
        "description": "공격력 +20%"
      },
      {
        "id": "trait_3e6f741d045e81d5a5dec8d4a910a988",
        "description": "[목화] 상태의 적이 입는 집중피해 +20%"
      },
      {
        "id": "trait_3e6f741d045e81ffa51ccf96492c8456",
        "description": "집중피해를 가할시 대상의 방어력 3s 동안 20% 감소"
      },
      {
        "id": "trait_3e6f741d045e817691c5ce541994dc54",
        "description": "대지속성 피해 +25%"
      },
      {
        "id": "trait_3e6f741d045e810bb4e3e507ad6f59e7",
        "description": "스킬 피해 +20%"
      },
      {
        "id": "trait_3e6f741d045e81ee9505cb412b728227",
        "description": "대지속성 스킬 피해를 가할시 대상에게 즉시 기존 피해 20%의 집중피해"
      }
    ]
  },
  "링커": {
    "sourceUrl": "https://luminous-rpg.notion.site/3d5f741d045e8045bceccc31784886cd",
    "traits": [
      {
        "id": "trait_3e6f741d045e8150b781e9581674f368",
        "description": "공격력 +20%"
      },
      {
        "id": "trait_3e6f741d045e81d091c5e2b707ca78ad",
        "description": "고유기의 지속시간을 10s로 변경"
      },
      {
        "id": "trait_3e6f741d045e8165be2ec710ae031e4c",
        "description": "고유기의 범위를 20칸으로 변경"
      },
      {
        "id": "trait_3e6f741d045e81f1b4e5e5c30c16abd8",
        "description": "[결속]의 계수를 50%로 변경"
      },
      {
        "id": "trait_3e6f741d045e810f95e5c6adf460807b",
        "description": "자멸 피해로 가하는 피해 +20%"
      },
      {
        "id": "trait_3e6f741d045e81a2b45bd1fcbb21cf12",
        "description": "[결속]이 부여된 대상의 받는 피해 10% 증가"
      }
    ]
  },
  "철혈기사": {
    "sourceUrl": "https://luminous-rpg.notion.site/39ef741d045e80febc32e509e4c42af0",
    "traits": [
      {
        "id": "trait_3e6f741d045e8156903bcf596b638ffa",
        "description": "방어력 감소량 100%로 변경"
      },
      {
        "id": "trait_3e6f741d045e81e3bc83c41916bc6d68",
        "description": "전환 시 치명타 확률 15%, 치명타 피해 20%"
      },
      {
        "id": "trait_3e6f741d045e81f38ad9f4c1442e673c",
        "description": "방어력 +30%"
      },
      {
        "id": "trait_3e6f741d045e81d09665c7f6e8934a28",
        "description": "피격 시 방어력 5% 증가 (최대 5중첩)"
      },
      {
        "id": "trait_3e6f741d045e8167b99feaf2cc906f72",
        "description": "체력이 50% 이하일 때 방어력 30% 증가"
      },
      {
        "id": "trait_3e6f741d045e816598d0f8b599d49c65",
        "description": "고유기 발동시 궁극기 포인트 20pt 회복"
      }
    ]
  },
  "역전자": {
    "sourceUrl": "https://luminous-rpg.notion.site/226f741d045e80ac8169ed3ebd6782b6",
    "traits": [
      {
        "id": "trait_3e6f741d045e81189340efd5e4d6613e",
        "description": "체력이 100%일 때 고유기 발동시 체력이 50%인걸로 간주"
      },
      {
        "id": "trait_3e6f741d045e81aaae25c9f6e6b13329",
        "description": "고유기 발동시 변경된 체력의 비율 만큼 공격력 증가"
      },
      {
        "id": "trait_3e6f741d045e816db9bbd9334ff9d5cb",
        "description": "고유기 발동시 궁극기 포인트 10pt 회복"
      },
      {
        "id": "trait_3e6f741d045e8118a1a0fdad5028d2da",
        "description": "체력 50%"
      },
      {
        "id": "trait_3e6f741d045e81ea8105c33c57d49606",
        "description": "넉백 저항 30%"
      },
      {
        "id": "trait_3e6f741d045e812eba9fcb37905b1732",
        "description": "고유기 조건을 만족한 상태에서 궁극기 사용시 고유기 함께 발동"
      }
    ]
  },
  "가디언": {
    "sourceUrl": "https://luminous-rpg.notion.site/228f741d045e80d3996acbb3a94eb582",
    "traits": [
      {
        "id": "trait_3e6f741d045e81be9bd5c7f9ef2f2764",
        "description": "고유기로 가하는 피해에 치명타 적용"
      },
      {
        "id": "trait_3e6f741d045e81e1aececb6c0f6f2b6b",
        "description": "고유기로 가하는 피해 +20%"
      },
      {
        "id": "trait_3e6f741d045e81ddb5eff490e5f285f9",
        "description": "고유기 발동 후 방어력 3s 동안 20% 증가"
      },
      {
        "id": "trait_3e6f741d045e81f09916ee9fb48dd4db",
        "description": "방어력 +80%"
      },
      {
        "id": "trait_3e6f741d045e81b79541ea618d2d25d0",
        "description": "고유기 명중시 궁극기 포인트 4pt 회복"
      },
      {
        "id": "trait_3e6f741d045e81b5bb9bf631834e4082",
        "description": "궁극기 발동시 주변 적들에게 방어력 700% 피해 주기"
      }
    ]
  },
  "철인": {
    "sourceUrl": "https://luminous-rpg.notion.site/171f741d045e814d9994d9035dbfdcc3",
    "traits": [
      {
        "id": "trait_3e6f741d045e81e28329de11fb734cbc",
        "description": "피해 감소 10%"
      },
      {
        "id": "trait_3e6f741d045e8145ae47d2d71070bf23",
        "description": "체력 10%"
      },
      {
        "id": "trait_3e6f741d045e81d897ede0cc2af53ecb",
        "description": "고유기로 반사하는 피해가 200% 증가"
      },
      {
        "id": "trait_3e6f741d045e8163822ad20d80a50714",
        "description": "고유기의 지속시간 6s로 변경"
      },
      {
        "id": "trait_3e6f741d045e813a8d71db326abb6b66",
        "description": "고유기 발동중 자신에게 피해를 입힌 적의 받는 피해 3s 동안 +8%"
      },
      {
        "id": "trait_3e6f741d045e81028771c9e9ed7e71dd",
        "description": "궁극기 사용시 주변 적들을 도발"
      }
    ]
  },
  "대리 기사": {
    "sourceUrl": "https://luminous-rpg.notion.site/3a7f741d045e80cda472d1c9c9567feb",
    "traits": [
      {
        "id": "trait_3e6f741d045e813d8665d80d282c30ba",
        "description": "순간이동 후, 주변 아군에게 피해감소 30%를 4s 동안 부여"
      },
      {
        "id": "trait_3e6f741d045e8155a98ec0fd6efa703f",
        "description": "고유기 발동 후, 주변 10칸내 적에게 방어력의 300% 피해"
      },
      {
        "id": "trait_3e6f741d045e8175b5a6cb34a87b5d8c",
        "description": "방어력 50%"
      },
      {
        "id": "trait_3e6f741d045e813ea2d3e3bc9a23b0a1",
        "description": "체력 50%"
      },
      {
        "id": "trait_3e6f741d045e81a780cbc896d4b51953",
        "description": "고유기 사용 후, 자신을 경직시키고 8s 동안 무적"
      },
      {
        "id": "trait_3e6f741d045e81628bf1ecd328e56033",
        "description": "이동 후 주변 아군을 이동 전 위치로 보내기"
      }
    ]
  },
  "양치기": {
    "sourceUrl": "https://luminous-rpg.notion.site/3a7f741d045e804c934cea28fd5c9b92",
    "traits": [
      {
        "id": "trait_3e6f741d045e81a8a93fda357a82bf6f",
        "description": "방어력 80% 증가"
      },
      {
        "id": "trait_3e6f741d045e81d0855ac27cff49a2fa",
        "description": "고유기 명중 적 하나당 에너지 5pt 회복"
      },
      {
        "id": "trait_3e6f741d045e81fa9b73ecc295514440",
        "description": "고유기 지속중 체력 5% 회복"
      },
      {
        "id": "trait_3e6f741d045e81c2934ef1a93b2d4bf0",
        "description": "고유기 지속중 받는 피해 60% 감소"
      },
      {
        "id": "trait_3e6f741d045e814dbb1bc8b8d9d082fe",
        "description": "고유기에 묶인 적들 받는 피해 +20%"
      },
      {
        "id": "trait_3e6f741d045e81e68b0af078e139f14b",
        "description": "고유기 지속중 이동속도 5pt 증가"
      }
    ]
  },
  "방패 용사": {
    "sourceUrl": "https://luminous-rpg.notion.site/3a7f741d045e803fb9a7e4786db84681",
    "traits": [
      {
        "id": "trait_3e6f741d045e81339937f7d4571b4d53",
        "description": "고유기 사용 후, 6s동안 받는 피해 감소 50%"
      },
      {
        "id": "trait_3e6f741d045e8150adebcfd78df7d46d",
        "description": "[방패]에 부딪히면 방어력의 400%만큼 데미지를 줍니다."
      },
      {
        "id": "trait_3e6f741d045e8105823ef08e5e1ee715",
        "description": "[방패]와 함께 자신도 돌진합니다."
      },
      {
        "id": "trait_3e6f741d045e8102ae6bf2354a7e4f85",
        "description": "방어력 50%"
      },
      {
        "id": "trait_3e6f741d045e81dc8546da603b0a72ee",
        "description": "체력 50%"
      },
      {
        "id": "trait_3e6f741d045e81a08eb5cfb17f0c9fb1",
        "description": "[방패]의 효과를 받는 피해 60%로 변경"
      }
    ]
  },
  "철의 거인": {
    "sourceUrl": "https://luminous-rpg.notion.site/3a7f741d045e8090b04bfef93e02eace",
    "traits": [
      {
        "id": "trait_3e6f741d045e819eb3cadccacc9286bf",
        "description": "고유기 사용 시 주변 8칸 아군에게 최대 체력의 10%만큼 체력 추가"
      },
      {
        "id": "trait_3e6f741d045e814c8879e5d3e7b6846f",
        "description": "회복력 +10%"
      },
      {
        "id": "trait_3e6f741d045e8115ab70d0865be601ef",
        "description": "상태 이상 저항 30%"
      },
      {
        "id": "trait_3e6f741d045e8175b8ccf2c1afce55b1",
        "description": "체력 30%"
      },
      {
        "id": "trait_3e6f741d045e81bbb7d4fef54472e69d",
        "description": "감소하는 현재 체력을 25%로 변경"
      },
      {
        "id": "trait_3e6f741d045e812fbc41fcf9c0bba2e9",
        "description": "고유기 사용 후 8s 동안 매 초 최대 체력의 5%만큼 회복"
      }
    ]
  },
  "가람": {
    "sourceUrl": "https://luminous-rpg.notion.site/3c1f741d045e803fa9f4e4f71e620873",
    "traits": [
      {
        "id": "trait_3e6f741d045e817a8230ebadaa52f672",
        "description": "방어력 +30%"
      },
      {
        "id": "trait_3e6f741d045e81408ddec35b568212cc",
        "description": "[수류]의 지속시간을 10s로 변경"
      },
      {
        "id": "trait_3e6f741d045e81adb2cbff42f03640b7",
        "description": "고유기 발동시 체력 10% 회복"
      },
      {
        "id": "trait_3e6f741d045e81cb95d2edc45debb81e",
        "description": "체력 +30%"
      },
      {
        "id": "trait_3e6f741d045e815d90c7d303197f4684",
        "description": "[수류] 상태에서 받는 피해 감소량 +15%"
      },
      {
        "id": "trait_3e6f741d045e814b8df1d8da0052aeab",
        "description": "[수류] 상태에서 피해를 입을시 궁극기 포인트 +1pt"
      }
    ]
  },
  "선포자": {
    "sourceUrl": "https://luminous-rpg.notion.site/3aaf741d045e80b2910be9b920c1c12a",
    "traits": [
      {
        "id": "trait_3e6f741d045e81aea101ef327c18c48f",
        "description": "방어력 +30%"
      },
      {
        "id": "trait_3e6f741d045e81859541f3265056002e",
        "description": "대지속성 피해 +15%"
      },
      {
        "id": "trait_3e6f741d045e81729653f4be88146d7f",
        "description": "표식이 있는 적에게 피해를 입을때마다 체력 10pt 회복"
      },
      {
        "id": "trait_3e6f741d045e81bc8a47d5f0e5e06825",
        "description": "피해 감소 10%"
      },
      {
        "id": "trait_3e6f741d045e814ba35efb8a3858097c",
        "description": "표식이 있는 적 공격력 감소 30%"
      },
      {
        "id": "trait_3e6f741d045e81e3ac03dfb5c1e623df",
        "description": "표식이 있는 적의 이동 속도 감소 20%"
      }
    ]
  },
  "채무 부여자": {
    "sourceUrl": "https://luminous-rpg.notion.site/3a8f741d045e8011b907e9a8392671e2",
    "traits": [
      {
        "id": "trait_3e6f741d045e812093fde748c5f58bb0",
        "description": "마력 구체를 나눠준 아군 방어력 +20%"
      },
      {
        "id": "trait_3e6f741d045e81cf8961ea5fca041df6",
        "description": "마력 구체를 나눠준 아군의 넉백 저항 +30%"
      },
      {
        "id": "trait_3e6f741d045e81e2bc30e54a6d335266",
        "description": "[채무자]가 대신 입는 피해 +20%"
      },
      {
        "id": "trait_3e6f741d045e8173be88e41992bd23eb",
        "description": "방어력 30%"
      },
      {
        "id": "trait_3e6f741d045e8123ab19c3d0961b0624",
        "description": "체력 30%"
      },
      {
        "id": "trait_3e6f741d045e81898639de12afd8c06f",
        "description": "고유기 사용 후 궁극기 에너지 5pt 회복"
      }
    ]
  },
  "유도자": {
    "sourceUrl": "https://luminous-rpg.notion.site/3a8f741d045e8087b043fcd9d7fa600b",
    "traits": [
      {
        "id": "trait_3a8f741d045e80929f8bfcf261f879a2",
        "description": "[방심] 스택을 가진 적이 가하는 피해 -40%"
      },
      {
        "id": "trait_3a8f741d045e804496bffc02dfc28d0a",
        "description": "연계 공격으로 가하는 피해 +30%"
      },
      {
        "id": "trait_3a8f741d045e8098b4d9c5333cc3699c",
        "description": "방어력 30%"
      },
      {
        "id": "trait_3a8f741d045e8018bad1da4a0933daf5",
        "description": "체력 30%"
      },
      {
        "id": "trait_3a8f741d045e80efa0cbd70395d5e8b3",
        "description": "고유기 사용 후 궁극기 에너지 5pt 회복"
      },
      {
        "id": "trait_3a8f741d045e803ab96bff7a4d492598",
        "description": "적이 [방심]을 부여받을때마다 30의 피해주기"
      }
    ]
  },
  "대리인": {
    "sourceUrl": "https://luminous-rpg.notion.site/3adf741d045e80f69ebbd0a8882ed10d",
    "traits": [
      {
        "id": "trait_3adf741d045e80d78f2efb6058f32076",
        "description": "[허수아비]의 받는 피해 10% 감소"
      },
      {
        "id": "trait_3adf741d045e80709656c06cab0db6d2",
        "description": "체력 +15%"
      },
      {
        "id": "trait_3adf741d045e80069d47ca9ffbae9ce7",
        "description": "방어력 +15%"
      },
      {
        "id": "trait_3adf741d045e809e9c3cf6a05c9f398a",
        "description": "체력 + 15%"
      },
      {
        "id": "trait_3adf741d045e80bfa7a1c2c1b7c96f45",
        "description": "체력 +15%"
      },
      {
        "id": "trait_3adf741d045e8042a1b8d82f5b880b0c",
        "description": "[허수아비]가 존재하는 동안 가하는 피해 +25%"
      }
    ]
  },
  "빙갑사": {
    "sourceUrl": "https://luminous-rpg.notion.site/3d5f741d045e8079b63adde108128304",
    "traits": [
      {
        "id": "trait_3e6f741d045e819a8318ddca2c944d44",
        "description": "고유기의 방어력 계수를 500%로 변경"
      },
      {
        "id": "trait_3e6f741d045e81de8064cc3586e3d895",
        "description": "방어력 +30%"
      },
      {
        "id": "trait_3e6f741d045e815d8b65dcf17a061d20",
        "description": "상태이상 명중 +10%"
      },
      {
        "id": "trait_3e6f741d045e81d1a26edb4c71975f89",
        "description": "고유기 사용 후 4s 동안 매초 최대체력의 10% 만큼 회복"
      },
      {
        "id": "trait_3e6f741d045e81b2abfbde949f9f6ac4",
        "description": "고유기의 범위를 20칸으로 변경"
      },
      {
        "id": "trait_3e6f741d045e819686e3f2b0d71286a4",
        "description": "고유기의 이동속도 감소량을 50%로 변경"
      }
    ]
  },
  "추방자": {
    "sourceUrl": "https://luminous-rpg.notion.site/3a7f741d045e8057bbecc7e1a23bfb62",
    "traits": [
      {
        "id": "trait_3e6f741d045e8123b106c9f4934247b1",
        "description": "고유기 발동 후 3s 동안 공격 속도 +10%"
      },
      {
        "id": "trait_3e6f741d045e812c8668eb6663f86013",
        "description": "고유기 발동 후 3s 동안 방어력 +30%"
      },
      {
        "id": "trait_3e6f741d045e81e0928bc9969d8e85f8",
        "description": "모든 피해를 입을때 8%로 무시"
      },
      {
        "id": "trait_3e6f741d045e8141aa5ef129ee56e677",
        "description": "고유기 발동시 궁극기 포인트 4pt 회복"
      },
      {
        "id": "trait_3e6f741d045e8144a71fe2811e21344b",
        "description": "궁극기 표식이 부여된 적들의 받는 피해 +50%"
      },
      {
        "id": "trait_3e6f741d045e81a58c60f7a835060956",
        "description": "원거리 피해 +50%"
      }
    ]
  },
  "요격대": {
    "sourceUrl": "https://luminous-rpg.notion.site/171f741d045e8154988ec9c55f4e759e",
    "traits": [
      {
        "id": "trait_3e6f741d045e81589519ea203bd0a3cc",
        "description": "고유기 발동시 궁극기 포인트 4pt 회복"
      },
      {
        "id": "trait_3e6f741d045e8113a50bd7e366ca00c7",
        "description": "근접 이외의 피해로도 고유기 발동 가능"
      },
      {
        "id": "trait_3e6f741d045e81df96c5c400ab499b9d",
        "description": "궁극기 표식의 피해 전달시 피해량 25% 증가"
      },
      {
        "id": "trait_3e6f741d045e81f7a557ce601e5aca87",
        "description": "궁극기의 표식이 부여된 적들의 이동속도 80% 감소"
      },
      {
        "id": "trait_3e6f741d045e81f78578eb7fdacf9bae",
        "description": "원거리 피해 +50%"
      },
      {
        "id": "trait_3e6f741d045e8199b46af0098e4dcaa5",
        "description": "고유기 발동시 5s 동안 무적 효과"
      }
    ]
  },
  "궁수": {
    "sourceUrl": "https://luminous-rpg.notion.site/228f741d045e804789d7e890e243aac7",
    "traits": [
      {
        "id": "trait_3e6f741d045e8126b864d5dbc559e623",
        "description": "고유기 명중시 [화살] 즉시 재장전"
      },
      {
        "id": "trait_3e6f741d045e818299cef4667bad9ded",
        "description": "고유기 발동시 궁극기 포인트 4pt 회복"
      },
      {
        "id": "trait_3e6f741d045e813cbcc8cf9d8ee3e024",
        "description": "원거리 피해 +50%"
      },
      {
        "id": "trait_3e6f741d045e81e2b01bc66edcee8751",
        "description": "궁극기 발동시 [화살] 즉시 장전"
      },
      {
        "id": "trait_3e6f741d045e81ccb9d6f49c1caf2433",
        "description": "[화살] 장전 도중 무적 효과 부여"
      },
      {
        "id": "trait_3e6f741d045e8124a272dd6b1d1c2311",
        "description": "고유기로 가하는 피해의 판정을 원거리 피해로 변경"
      }
    ]
  },
  "매복자": {
    "sourceUrl": "https://luminous-rpg.notion.site/39af741d045e8030b2c9d9b264e553c6",
    "traits": [
      {
        "id": "trait_3e6f741d045e8100a538d39b2e48595a",
        "description": "고유기 지속 중 치명타 확률 +15%"
      },
      {
        "id": "trait_3e6f741d045e8194bb9bdb505085a691",
        "description": "궁극기 표식이 부여된 적들의 받는 피해 +50%"
      },
      {
        "id": "trait_3e6f741d045e816fa542cd160331dd85",
        "description": "궁극기 표식이 부여된 적들에게 공격력 100% 근접 피해"
      },
      {
        "id": "trait_3e6f741d045e81d7bcd0c717359526b7",
        "description": "고유기 지속 중 원거리 피해 +15%"
      },
      {
        "id": "trait_3e6f741d045e81be8c14d8e0c42994cb",
        "description": "원거리 피해 +50%"
      },
      {
        "id": "trait_3e6f741d045e81bf9067d451da0913db",
        "description": "고유기 발동시 궁극기 포인트 4pt 회복"
      }
    ]
  },
  "하늘의 사도": {
    "sourceUrl": "https://luminous-rpg.notion.site/3a8f741d045e80abb3aac3104a4315c9",
    "traits": [
      {
        "id": "trait_3e6f741d045e81429d30cff28f80fc06",
        "description": "추가 피해 +20%"
      },
      {
        "id": "trait_3e6f741d045e81c5a161e25ea90aefe3",
        "description": "고유기 발동시 [신내림] 1pt 추가 획득"
      },
      {
        "id": "trait_3e6f741d045e81a18de2c8fb1d9dbb68",
        "description": "고유기 발동시 궁극기 포인트 5pt 추가 회복"
      },
      {
        "id": "trait_3e6f741d045e818c8508ee2cbe55f1b0",
        "description": "[신내림] 번개 피해를 입은 적들에게 궁극기 디버프 부여"
      },
      {
        "id": "trait_3e6f741d045e8177b600c9642e9a5f8c",
        "description": "궁극기 [신내림] 소모 도중 무적"
      },
      {
        "id": "trait_3e6f741d045e8195a719c272b76404c7",
        "description": "번개 속성 피해 +30%"
      }
    ]
  },
  "광란의 사수": {
    "sourceUrl": "https://luminous-rpg.notion.site/3a7f741d045e80539857e79e4e93bfa3",
    "traits": [
      {
        "id": "trait_3e6f741d045e814589cbc5a7a6a5316d",
        "description": "공중에서 가하는 피해 +20%"
      },
      {
        "id": "trait_3e6f741d045e812cac94f95f36116cd6",
        "description": "질주 도중 피해 무시"
      },
      {
        "id": "trait_3e6f741d045e819c9d2bdf3dbbb02e55",
        "description": "고유기 발동시 궁극기 포인트 4pt 회복"
      },
      {
        "id": "trait_3e6f741d045e81668687e230e1381b85",
        "description": "원거리 피해 +50%"
      },
      {
        "id": "trait_3e6f741d045e81f5abe3c27f0e7628da",
        "description": "질주 스택당 가하는 피해 +10%"
      },
      {
        "id": "trait_3e6f741d045e817287f8f1b6f497f988",
        "description": "궁극기 발동시 즉시 [질주] 6pt 획득"
      }
    ]
  },
  "마탄의 사수": {
    "sourceUrl": "https://luminous-rpg.notion.site/3a7f741d045e805e8ca9ff92c43e8c35",
    "traits": [
      {
        "id": "trait_3e6f741d045e812eb2e2efc1c2d105ed",
        "description": "[저주]의 저항 감소율이 50%로 증가"
      },
      {
        "id": "trait_3e6f741d045e8112b565f225052c9f22",
        "description": "[필살]의 공격력 계수를 999%로 증가"
      },
      {
        "id": "trait_3e6f741d045e818fa54bc6c46d2c0e6d",
        "description": "원거리 피해 50%"
      },
      {
        "id": "trait_3e6f741d045e819a8ca9dee3539ae174",
        "description": "[파쇄]의 방어력 감소율이 40%로 증가"
      },
      {
        "id": "trait_3e6f741d045e81eeaa01c262cc4775e5",
        "description": "이동 속도 20%"
      },
      {
        "id": "trait_3e6f741d045e8150b283fc24107e5529",
        "description": "[약화]의 공격력 감소율이 70%로 증가"
      }
    ]
  },
  "서리꾼": {
    "sourceUrl": "https://luminous-rpg.notion.site/3d7f741d045e8091ae99f998d42dc260",
    "traits": [
      {
        "id": "trait_3e6f741d045e81ca99edd3d4420fe7e1",
        "description": "고유기로 피해를 가한 적 빙결 2 누적"
      },
      {
        "id": "trait_3e6f741d045e819096d2fac08d16df53",
        "description": "궁극기 표식이 부여된 적들은 빙결 10을 누적"
      },
      {
        "id": "trait_3e6f741d045e8100bff3f18ee920e679",
        "description": "원거리 피해 +35%"
      },
      {
        "id": "trait_3e6f741d045e81c2a560f33d017c90e5",
        "description": "고유기 발동시 궁극기 포인트 5pt 회복"
      },
      {
        "id": "trait_3e6f741d045e81ba9c99f14c8bf45d5b",
        "description": "궁극기 발동시 5s 동안 공격 속도 +20%"
      },
      {
        "id": "trait_3e6f741d045e816e8674da3f5e2f024d",
        "description": "물 속성 피해 +30%"
      }
    ]
  },
  "대식가": {
    "sourceUrl": "https://luminous-rpg.notion.site/ca775d4ceb0540e3942847464d55712c",
    "traits": [
      {
        "id": "trait_3e6f741d045e81a99fade2b51a90e454",
        "description": "공격력 +30%"
      },
      {
        "id": "trait_3e6f741d045e81a6bb30e244a9e1689e",
        "description": "음식을 먹을 때마다 자신과 5칸 이내 아군의 체력을 50pt 회복"
      },
      {
        "id": "trait_3e6f741d045e81a7b958d07801b22d6b",
        "description": "체력 +30%"
      },
      {
        "id": "trait_3e6f741d045e81c8a6a4cffd6677fc2b",
        "description": "궁극기 발동시 배고픔을 최대치까지 회복"
      },
      {
        "id": "trait_3e6f741d045e8158a2acfe8737bfc158",
        "description": "고유기 피해 1회당 부상 상태 누적 16을 가함"
      },
      {
        "id": "trait_3e6f741d045e8149a87bd1fb7ccd5d05",
        "description": "고유기 발동시 궁극기 포인트를 4pt 회복"
      }
    ]
  },
  "소음꾼": {
    "sourceUrl": "https://luminous-rpg.notion.site/227f741d045e80738d11eaf44b2329cb",
    "traits": [
      {
        "id": "trait_3e6f741d045e81f487b6e20158f0ea9a",
        "description": "[유대의 사슬]이 연결된 아군은 가하는 피해가 30% 증가"
      },
      {
        "id": "trait_3e6f741d045e816a9ff0da6c951dad03",
        "description": "고유기의 재사용 대기 시간 5s 감소"
      },
      {
        "id": "trait_3e6f741d045e811cb1bdc526a34f3a3b",
        "description": "체력 +30%"
      },
      {
        "id": "trait_3e6f741d045e8105bfc4e6ce7eafae66",
        "description": "궁극기 발동 후 궁극기 포인트 20pt 반환"
      },
      {
        "id": "trait_3e6f741d045e81b4a2ccd3f0348101af",
        "description": "경직된 아군의 수당 자신의 가하는 피해 1s 동안 20% 증가"
      },
      {
        "id": "trait_3e6f741d045e810887baca6e1d930082",
        "description": "고유기 발동시 궁극기 포인트를 4pt 회복"
      }
    ]
  },
  "회복술사": {
    "sourceUrl": "https://luminous-rpg.notion.site/228f741d045e80d3ba2cd00217624a7c",
    "traits": [
      {
        "id": "trait_3e6f741d045e8188b804e94c1f3bc33f",
        "description": "고유기 재사용 대기시간 -2s"
      },
      {
        "id": "trait_3e6f741d045e817c8940fa08af5fcfe5",
        "description": "회복력 +30%"
      },
      {
        "id": "trait_3e6f741d045e81379e8adb31afed2373",
        "description": "체력 +30%"
      },
      {
        "id": "trait_3e6f741d045e8154b024ec87ec6bda21",
        "description": "[유대의 사슬]이 연결된 아군은 최대 체력이 50% 증가"
      },
      {
        "id": "trait_3e6f741d045e815b955ae6b08624fcc3",
        "description": "고유기 발동시 궁극기 포인트를 3pt 회복"
      },
      {
        "id": "trait_3e6f741d045e8125bc55f75767e4a0b7",
        "description": "고유기 범위 내에 언데드인 적이 있다면 회복량 만큼 피해 주기"
      }
    ]
  },
  "제육볶이": {
    "sourceUrl": "https://luminous-rpg.notion.site/228f741d045e80afad2ee43483cb31f3",
    "traits": [
      {
        "id": "trait_3e6f741d045e81919e7df21411a1c28a",
        "description": "[유대의 사슬]이 연결된 아군의 공격력 5% 증가"
      },
      {
        "id": "trait_3e6f741d045e81f1916ff5f3b95d18ea",
        "description": "회복력 +50%"
      },
      {
        "id": "trait_3e6f741d045e81c1b36cd724204269fa",
        "description": "고유기로 아군 회복 부여시 5s 동안 25pt 회복"
      },
      {
        "id": "trait_3e6f741d045e813d80cfffc629eef91f",
        "description": "고유기 회복량 +20pt"
      },
      {
        "id": "trait_3e6f741d045e8196bbfdde4e22aacfed",
        "description": "고유기 발동시 조건 없이 대상 아군의 궁극기 포인트 5pt 회복"
      },
      {
        "id": "trait_3e6f741d045e81439debe16a95e6ffd6",
        "description": "고유기의 궁극기 포인트 회복을 자신에게도 적용"
      }
    ]
  },
  "요리사": {
    "sourceUrl": "https://luminous-rpg.notion.site/39ef741d045e8004a61cc81a5fe4884d",
    "traits": [
      {
        "id": "trait_3e6f741d045e81ff8a94c01b5a91a4ca",
        "description": "공격력 +20%"
      },
      {
        "id": "trait_3e6f741d045e8181bf57d7131c5e8e10",
        "description": "빵 확률 증가"
      },
      {
        "id": "trait_3e6f741d045e812d9d01e0c8a42408dc",
        "description": "케이크 확률 증가"
      },
      {
        "id": "trait_3e6f741d045e81028aaec68fb18e0702",
        "description": "황금사과 확률 증가"
      },
      {
        "id": "trait_3e6f741d045e8151b871d2d7d191d0f2",
        "description": "호박파이 확률 증가"
      },
      {
        "id": "trait_3e6f741d045e81a59ff7e3c7837013e3",
        "description": "고유기 발동시 궁극기 포인트를 4pt 회복"
      }
    ]
  },
  "비바라기": {
    "sourceUrl": "https://luminous-rpg.notion.site/3a8f741d045e809d886bcdefc6117922",
    "traits": [
      {
        "id": "trait_3e6f741d045e810987b8e96e3fd98576",
        "description": "[물방울]을 보유한 아군에게 공격력 15% 증가"
      },
      {
        "id": "trait_3e6f741d045e817ebd81d66c1d502f01",
        "description": "[물방울]의 피해면역 횟수 2회로 증가"
      },
      {
        "id": "trait_3e6f741d045e81269921d87b31984328",
        "description": "[물방울]을 보유한 아군에게 매초 [비바라기]의 최대 체력의 3%만큼 회복"
      },
      {
        "id": "trait_3e6f741d045e81c89594fcf577ad8611",
        "description": "체력 50%"
      },
      {
        "id": "trait_3e6f741d045e818b9e22cbc426005e5b",
        "description": "고유기의 범위가 30칸으로 증가"
      },
      {
        "id": "trait_3e6f741d045e81dcba62de131fbc4702",
        "description": "고유기 발동 시 궁극기 포인트 4pt 회복"
      }
    ]
  },
  "텔레포터": {
    "sourceUrl": "https://luminous-rpg.notion.site/3a8f741d045e8012b5afc8d485f22d6f",
    "traits": [
      {
        "id": "trait_3e6f741d045e813ba6a8d07e79243f28",
        "description": "[유대의 사슬]이 걸린 아군은 포탈 이용시 치명타 확률 +15%"
      },
      {
        "id": "trait_3e6f741d045e81939193e55f4b0306c6",
        "description": "적들이 포탈을 탈 수 있음"
      },
      {
        "id": "trait_3e6f741d045e8175ab65de277ba44b29",
        "description": "재사용 대기시간 1s, 포탈 지속시간 0.6s로 변경"
      },
      {
        "id": "trait_3e6f741d045e810d88f1cada7b36c489",
        "description": "포탈이 주변 적들을 끌어당김"
      },
      {
        "id": "trait_3e6f741d045e81df8ba6ec93423c0808",
        "description": "포탈 주변 적들에게 지속적으로 속박 5 누적"
      },
      {
        "id": "trait_3e6f741d045e81ae9c37f3d85b17c281",
        "description": "포탈의 이동 범위 3칸으로 감소"
      }
    ]
  },
  "브라보": {
    "sourceUrl": "https://luminous-rpg.notion.site/3d7f741d045e802faa77d6338949b9ec",
    "traits": [
      {
        "id": "trait_3e6f741d045e814dab59f846f66523cc",
        "description": "피해 증가를 받지 못한 아군의 치명타 피해 +10%"
      },
      {
        "id": "trait_3e6f741d045e81029ff4c438d61dfafa",
        "description": "주변에 아군이 한명 더 있다고 간주"
      },
      {
        "id": "trait_3e6f741d045e81cfb33dcb3e71153ecd",
        "description": "체력 50%"
      },
      {
        "id": "trait_3e6f741d045e810aac19cf492151d94d",
        "description": "피해 증가를 받은 아군이 에너지 +50pt"
      },
      {
        "id": "trait_3e6f741d045e8143b753d0bb53960b70",
        "description": "고유기 발동시 자신의 에너지 20pt 회복"
      },
      {
        "id": "trait_3e6f741d045e81c2951bc9d1fafda3a4",
        "description": "고유기 발동 시 궁극기 포인트 4pt 회복"
      }
    ]
  },
  "아티스타": {
    "sourceUrl": "https://luminous-rpg.notion.site/3b6f741d045e805489b6fcedd10fa482",
    "traits": [
      {
        "id": "trait_3e6f741d045e81d3a49bea7ae4d1b6a6",
        "description": "회복력 +30%"
      },
      {
        "id": "trait_3e6f741d045e81648db4fe47325acc68",
        "description": "회복력 +30%"
      },
      {
        "id": "trait_3e6f741d045e81ccaf8dc497969f3eec",
        "description": "체력 +30%"
      },
      {
        "id": "trait_3e6f741d045e81778997f7b23c5cae24",
        "description": "이동속도 +10%"
      },
      {
        "id": "trait_3e6f741d045e813a9cb5d3b9935f4edb",
        "description": "이동속도 +10%"
      },
      {
        "id": "trait_3e6f741d045e81a89d05d118211b10f6",
        "description": "이동속도 +5pt"
      }
    ]
  },
  "농부": {
    "sourceUrl": "https://luminous-rpg.notion.site/39ef741d045e80329b3bfe6e2a4a881c",
    "traits": [
      {
        "id": "trait_3e6f741d045e81b2aa5cd004595c14ae",
        "description": "농작물 성장치 +6%"
      },
      {
        "id": "trait_3e6f741d045e8199a3bbe798b1eebb72",
        "description": "8% 확률로 고유기 발동시 성장한 농작물 즉시 수확"
      },
      {
        "id": "trait_3e6f741d045e812d864ce49468ddda46",
        "description": "고유기 발동시 범위 내 아군 회복"
      },
      {
        "id": "trait_3e6f741d045e818fabf2ffe3a85232d1",
        "description": "고유기 회복량 50pt 증가"
      },
      {
        "id": "trait_3e6f741d045e81b6a4ffd5a6033a5570",
        "description": "고유기로 농작물 성장시 궁극기 포인트 1pt"
      },
      {
        "id": "trait_3e6f741d045e8197affdf47a27c0215a",
        "description": "5% 확률로 고유기 농작물 성장치 +20%"
      }
    ]
  },
  "도박꾼": {
    "sourceUrl": "https://luminous-rpg.notion.site/39ff741d045e80c69156d56d32b87001",
    "traits": [
      {
        "id": "trait_3e6f741d045e81ebb79ee23eb929c424",
        "description": "777을 2번 연속 뽑을시 궁극기 포인트 +90pt"
      },
      {
        "id": "trait_3e6f741d045e8114baf6f733a615fd10",
        "description": "고유기 재사용 대기시간 2s 감소"
      },
      {
        "id": "trait_3e6f741d045e812a9c4fd848a4fe999e",
        "description": "궁극기 발동시 즉시 777"
      },
      {
        "id": "trait_3e6f741d045e817297adfdff9241401e",
        "description": "7이 뜰 확률 증가"
      },
      {
        "id": "trait_3e6f741d045e8195aa65e476e91a69b7",
        "description": "숫자 미일치 지속시간 3s 감소"
      },
      {
        "id": "trait_3e6f741d045e81129318c672903d9b82",
        "description": "고유기 발동시 궁극기 포인트 +3pt"
      }
    ]
  },
  "풍압술사": {
    "sourceUrl": "https://luminous-rpg.notion.site/39ff741d045e80d489c1c7de7438344f",
    "traits": [
      {
        "id": "trait_3e6f741d045e81e2bd80d1ab9d77f0e5",
        "description": "풍압 상태의 적 방어력 30% 감소"
      },
      {
        "id": "trait_3e6f741d045e819784aceafa6552a08d",
        "description": "궁극기 발동시 1회 고유기 연속 발동 가능"
      },
      {
        "id": "trait_3e6f741d045e8141a2c8e3eacfa357ac",
        "description": "고유기 착지시 주변 10칸 아군 회복"
      },
      {
        "id": "trait_3e6f741d045e81a5ac83c030c58d7adc",
        "description": "고유기 공중에 떠있는 동안 무적"
      },
      {
        "id": "trait_3e6f741d045e8195880bc3496e52e65e",
        "description": "고유기로 적 명중시 궁극기 포인트 +5pt"
      },
      {
        "id": "trait_3e6f741d045e81d5985bc39c96de41ec",
        "description": "기술 피해 +50%"
      }
    ]
  },
  "낚시꾼": {
    "sourceUrl": "https://luminous-rpg.notion.site/39ef741d045e80758e95cec9afb686a9",
    "traits": [
      {
        "id": "trait_3e6f741d045e812d94c5df90c57ac9c3",
        "description": "고유기 에어본 누적량 +10"
      },
      {
        "id": "trait_3e6f741d045e813d8de5fd3445ec7eab",
        "description": "월척 확률 +20%"
      },
      {
        "id": "trait_3e6f741d045e81bbbb01df8bee854dd3",
        "description": "10%로 낚시 보상 2배 획득"
      },
      {
        "id": "trait_3e6f741d045e8194a6cae95c679b54f2",
        "description": "일반 낚시 대기 시간 감소"
      },
      {
        "id": "trait_3e6f741d045e817fa825e27ad8eebc75",
        "description": "고유기로 적 명중시 궁극기 포인트 +10pt"
      },
      {
        "id": "trait_3e6f741d045e811bbdf2d2f7182c1dce",
        "description": "낚시터에서 궁극기 발동시 즉시 월척"
      }
    ]
  },
  "광부": {
    "sourceUrl": "https://luminous-rpg.notion.site/3a7f741d045e8011a6c4c2c8ad06f110",
    "traits": [
      {
        "id": "trait_3e6f741d045e8168bedbd0224d4f6945",
        "description": "광물 드랍량 10%로 2배"
      },
      {
        "id": "trait_3e6f741d045e81e09256de977c2bfbe6",
        "description": "일반 광물 드랍량 15%로 2배"
      },
      {
        "id": "trait_3e6f741d045e811e8234c065b7b514dc",
        "description": "광질에서 10%로 치명타 발동"
      },
      {
        "id": "trait_3e6f741d045e819088b8ca59cb2f0182",
        "description": "광물을 캘때마다 곡괭이 내구도 5 복구"
      },
      {
        "id": "trait_3e6f741d045e814581fee4c284b14c55",
        "description": "철골렘에게 가하는 피해 2배"
      },
      {
        "id": "trait_3e6f741d045e81a199b6e29d7d031fbc",
        "description": "희귀 광물 드랍량 5%로 2배"
      }
    ]
  }
};
