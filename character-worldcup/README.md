# 캐릭터 이상형 월드컵 · 취향 유형 테스트

캐릭터를 이상형 월드컵 방식으로 골라 나가면, 선택한 캐릭터들의 성향을 바탕으로
MBTI처럼 4글자 **취향 유형**을 알려주는 웹사이트입니다.
빌드 과정 없이 HTML/CSS/JS만으로 동작하므로 GitHub Pages에 그대로 올릴 수 있습니다.

## 폴더 구조

```
character-worldcup/
├── index.html        # 화면 구조
├── style.css         # 디자인
├── data.js           # ✏️ 내용 설정 (캐릭터, 축, 결과 유형) — 여기만 수정
├── script.js         # 게임·결과 계산 기능 (수정 불필요)
└── images/
    ├── characters/   # 캐릭터 사진
    └── types/        # 결과 유형 이미지
```

## 내용 채우기 (`data.js`)

| 항목 | 설명 |
|---|---|
| `SITE` | 사이트 제목, 소개 문구, 대표 이미지 |
| `AXES` | 취향을 나누는 4개 축 (예: 밝음 S / 차분 M) |
| `CHARACTERS` | 캐릭터 이름·사진·설명·성향 값(`traits`, -2 ~ +2) |
| `RESULT_TYPES` | 4글자 조합 16가지 유형의 이름·설명·이미지 |
| `ROUND_WEIGHT`, `WINNER_BONUS` | 라운드별 점수 가중치 |
| `ROUND_OPTIONS` | 고를 수 있는 강 수 (예: `[16, 8]`) |

사진은 `images/` 폴더에 넣고 경로로 적습니다.

```js
{ id:1, name:"캐릭터 이름", image:"images/characters/1.jpg", desc:"한 줄 소개",
  traits:{ mood:-2, charm:1, heart:2, style:0 } },
```

`image`, `desc`를 비워두면 빈 자리 표시가 나옵니다.

### 유형이 정해지는 방식
1. 캐릭터를 고를 때마다 그 캐릭터의 `traits` 값이 축별 점수에 더해집니다.
2. 뒤 라운드에서 고를수록 가중치가 커지고, 최종 우승 캐릭터는 추가 점수를 받습니다.
3. 축마다 점수가 음수면 왼쪽 글자, 양수면 오른쪽 글자를 골라 4글자 코드를 만듭니다.

## 로컬에서 실행

`index.html`을 브라우저로 열면 바로 실행됩니다.

## GitHub Pages로 배포

1. GitHub에서 새 저장소를 만듭니다.
2. 이 폴더의 파일을 저장소에 올립니다.
   ```bash
   git init
   git add .
   git commit -m "첫 커밋"
   git branch -M main
   git remote add origin https://github.com/<사용자명>/<저장소명>.git
   git push -u origin main
   ```
3. 저장소 **Settings → Pages**에서 Source를 `Deploy from a branch`, Branch를 `main` / `/ (root)`로 지정하고 저장합니다.
4. 잠시 후 `https://<사용자명>.github.io/<저장소명>/` 주소로 접속할 수 있습니다.
