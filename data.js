/* =====================================================================
   ✏️ 여기만 수정하면 됩니다 — 사이트 내용 설정
   ---------------------------------------------------------------------
   · image : 이미지 경로. 비워두면("") 빈 사진 자리가 표시됩니다.
             예) "images/characters/1.jpg"
   · desc  : 설명. 비워두면 "설명을 입력하세요" 자리 표시가 나옵니다.
   ===================================================================== */

const SITE = {
  title: "캐릭터 이상형 월드컵",
  desc: "끌리는 캐릭터를 하나씩 골라보세요.\n당신의 선택으로 숨은 취향 유형을 알려드립니다.",
  image: ""                       // 시작 화면 대표 이미지
};

/* 취향을 나누는 4개의 축 (MBTI의 E/I, S/N… 같은 역할)
   캐릭터의 traits 값이 음수(-)면 left 쪽, 양수(+)면 right 쪽 점수가 됩니다. */
const AXES = [
  { key:"mood",  left:{code:"S", label:"밝음"},   right:{code:"M", label:"차분"} },
  { key:"charm", left:{code:"C", label:"귀여움"}, right:{code:"K", label:"멋짐"} },
  { key:"heart", left:{code:"W", label:"다정"},   right:{code:"T", label:"시크"} },
  { key:"style", left:{code:"N", label:"수수"},   right:{code:"G", label:"화려"} },
];

/* 캐릭터 목록 — traits는 -2 ~ +2 사이 값 (0 = 중립)
   16명 기준. 8강만 할 경우 이 중 8명이 무작위로 뽑힙니다. */
const CHARACTERS = [
  { id:1,  name:"캐릭터 1",  image:"", desc:"", traits:{ mood:-2, charm:-2, heart:-1, style: 1 } },
  { id:2,  name:"캐릭터 2",  image:"", desc:"", traits:{ mood: 2, charm: 2, heart: 2, style:-1 } },
  { id:3,  name:"캐릭터 3",  image:"", desc:"", traits:{ mood:-1, charm: 1, heart:-2, style:-2 } },
  { id:4,  name:"캐릭터 4",  image:"", desc:"", traits:{ mood: 1, charm:-1, heart: 1, style: 2 } },
  { id:5,  name:"캐릭터 5",  image:"", desc:"", traits:{ mood:-2, charm: 1, heart: 1, style: 1 } },
  { id:6,  name:"캐릭터 6",  image:"", desc:"", traits:{ mood: 2, charm:-2, heart:-1, style:-1 } },
  { id:7,  name:"캐릭터 7",  image:"", desc:"", traits:{ mood:-1, charm:-1, heart: 2, style:-2 } },
  { id:8,  name:"캐릭터 8",  image:"", desc:"", traits:{ mood: 1, charm: 2, heart:-2, style: 2 } },
  { id:9,  name:"캐릭터 9",  image:"", desc:"", traits:{ mood:-2, charm:-1, heart:-2, style: 2 } },
  { id:10, name:"캐릭터 10", image:"", desc:"", traits:{ mood: 2, charm: 1, heart: 1, style:-2 } },
  { id:11, name:"캐릭터 11", image:"", desc:"", traits:{ mood:-1, charm: 2, heart:-1, style: 1 } },
  { id:12, name:"캐릭터 12", image:"", desc:"", traits:{ mood: 1, charm:-2, heart: 2, style: 1 } },
  { id:13, name:"캐릭터 13", image:"", desc:"", traits:{ mood:-2, charm: 2, heart: 2, style:-1 } },
  { id:14, name:"캐릭터 14", image:"", desc:"", traits:{ mood: 2, charm:-1, heart:-2, style: 1 } },
  { id:15, name:"캐릭터 15", image:"", desc:"", traits:{ mood:-1, charm:-2, heart: 1, style:-1 } },
  { id:16, name:"캐릭터 16", image:"", desc:"", traits:{ mood: 1, charm: 1, heart:-1, style:-2 } },
];

/* 결과 유형 — 4축 조합 16가지. 비워둔 항목은 자동으로 빈 자리가 표시됩니다.
   예) "SCWN": { title:"햇살 같은 순둥이파", desc:"...", image:"" } */
const RESULT_TYPES = {
  // "SCWN": { title:"", desc:"", image:"images/types/SCWN.jpg" },
};

/* 점수 가중치 — 뒤 라운드에서 고를수록 취향이 더 강하게 반영됩니다. */
const ROUND_WEIGHT = { 16:1, 8:1.5, 4:2, 2:3 };
const WINNER_BONUS = 2;           // 최종 우승 캐릭터 추가 가중치
const ROUND_OPTIONS = [16, 8];    // 시작 화면에서 고를 수 있는 강 수
