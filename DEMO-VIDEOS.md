# SafeCall 데모 영상 제작 가이드

> 워크플로우: Nano/Banana (이미지 생성) → Veo 3.1 (이미지 기반 영상 생성)

---

## 촬영 관점

모든 영상은 **실내 천장/벽면 고정 홈캠 시점**으로 촬영.
- 고정된 앵글 (CCTV/홈캠 느낌)
- 약간 높은 위치에서 내려다보는 각도
- 광각 렌즈 왜곡 약간 포함
- 해상도: 홈캠 수준 (약간 거친 화질, 완벽하지 않은 조명)
- 타임스탬프 오버레이 (선택 — 후처리로 추가 가능)

---

## 시나리오 1: 화재 오인 (수증기)

### 목적
부엌에서 요리 중 수증기가 올라오는 장면. Gemini가 "화재 아님, 수증기"로 판단하는 근거가 되는 영상.

### 씬 구성

| 씬 | 설명 | 시간 | Gemini 판단 |
|----|------|------|------------|
| 1-1 | 부엌 전경 — 평화로운 상태 | 0~3초 | 정상 |
| 1-2 | 가스레인지 위 냄비에서 수증기 올라옴 | 3~7초 | 수증기 감지 |
| 1-3 | 수증기가 더 많아지며 연기처럼 보임 | 7~12초 | 화재 오인 가능성 분석 |
| 1-4 | 어르신이 부엌에서 전화기 들고 있음 | 12~15초 | 비응급 확인 (사람 정상 활동) |

### 이미지 프롬프트

**씬 1-1: 부엌 전경 (평화로운 상태)**
```
A Korean apartment kitchen viewed from a wall-mounted security camera angle,
slightly elevated perspective looking down. Small but tidy kitchen with
gas stove, rice cooker, sink, and dish rack. Warm fluorescent lighting.
An elderly Korean woman standing near the counter. Daytime.
Realistic home CCTV footage style, slightly grainy quality, wide-angle lens.
```

**씬 1-2: 수증기 발생**
```
Same Korean apartment kitchen from wall-mounted security camera angle.
A pot on the gas stove with visible white steam rising up.
An elderly Korean woman cooking, stirring the pot.
The steam is clearly white and translucent, rising vertically from the pot.
Warm kitchen lighting. Realistic home CCTV footage style, slightly grainy.
```

**씬 1-3: 수증기 증가 (연기처럼 보임)**
```
Same Korean apartment kitchen from wall-mounted security camera angle.
Heavy white steam billowing from the pot on the gas stove,
spreading across the upper part of the kitchen, partially obscuring the ceiling.
Could be mistaken for smoke at first glance but is clearly steam/vapor.
The elderly woman is still standing near the stove normally.
Realistic home CCTV footage, slightly grainy, warm lighting diffused by steam.
```

**씬 1-4: 어르신이 전화하는 장면**
```
Same Korean apartment kitchen from wall-mounted security camera angle.
An elderly Korean woman standing in the kitchen holding a smartphone to her ear,
looking worried. Steam still visible from the pot on the stove behind her.
She appears anxious but physically unharmed.
Realistic home CCTV footage style, slightly grainy quality.
```

### Veo 영상 프롬프트 (씬 1-2 이미지 기반)
```
A home security camera footage of a Korean apartment kitchen.
An elderly woman is cooking at the gas stove. White steam gradually rises
from a boiling pot, becoming thicker over 10 seconds. The steam spreads
across the upper kitchen area. The woman continues cooking normally,
then picks up her phone looking worried. Fixed camera angle, no camera movement.
Realistic CCTV quality, slightly grainy. 15 seconds duration.
```

---

## 시나리오 2: 실제 응급 — 낙상

### 목적
거실에서 어르신이 넘어져 바닥에 쓰러져 있는 장면. Gemini가 "낙상 감지"로 판단하는 근거.

### 씬 구성

| 씬 | 설명 | 시간 | Gemini 판단 |
|----|------|------|------------|
| 2-1 | 거실 전경 — 어르신이 걸어다니는 중 | 0~3초 | 정상 |
| 2-2 | 어르신이 발을 헛디뎌 넘어짐 | 3~6초 | 동작 이상 감지 |
| 2-3 | 바닥에 쓰러진 채 움직이지 못함 | 6~12초 | 낙상 확인 |
| 2-4 | 쓰러진 채 손을 뻗어 전화기 잡으려 함 | 12~15초 | 응급 상황 확정 |

### 이미지 프롬프트

**씬 2-1: 거실 전경 (정상)**
```
A Korean apartment living room viewed from a wall-mounted security camera angle,
elevated perspective. Typical Korean living room with sofa, TV, low table,
and floor heating (ondol). An elderly Korean woman walking slowly across
the room. Daytime, natural light from window.
Realistic home CCTV footage style, slightly grainy, wide-angle.
```

**씬 2-2: 넘어지는 순간**
```
Same Korean apartment living room from wall-mounted security camera angle.
An elderly Korean woman in the process of falling, losing balance near
the low table. Her body is tilted sideways, arms reaching out to grab
something. Motion blur on her body. A small rug or slippers visible
near her feet as the cause. Realistic home CCTV footage, slightly grainy.
```

**씬 2-3: 바닥에 쓰러진 상태**
```
Same Korean apartment living room from wall-mounted security camera angle.
An elderly Korean woman lying on the floor next to the low table,
not moving. She is on her side, one arm extended.
She appears to be in pain or unable to get up.
The scene looks alarming from the camera perspective.
Realistic home CCTV footage style, slightly grainy, daytime lighting.
```

**씬 2-4: 전화기 잡으려는 장면**
```
Same Korean apartment living room from wall-mounted security camera angle.
An elderly Korean woman lying on the floor, reaching out with one hand
toward a smartphone on the low table above her.
She is struggling to reach it, clearly in distress.
Realistic home CCTV footage style, slightly grainy.
```

### Veo 영상 프롬프트 (씬 2-1 이미지 기반)
```
Home security camera footage of a Korean apartment living room.
An elderly woman walks slowly across the room, then trips on a small rug
near the low table and falls to the floor. She lands on her side and
does not get up. After a few seconds, she slowly reaches toward her
smartphone on the table. Fixed camera angle, no camera movement.
Realistic CCTV quality, slightly grainy. 15 seconds duration.
```

---

## 시나리오 3: 정상 상태

### 목적
평화로운 일상 장면. Gemini가 "이상 없음"으로 판단하는 기준선(baseline) 영상. 데모 대시보드에서 "현재 홈캠 상태"로 보여줄 수 있음.

### 씬 구성

| 씬 | 설명 | 시간 | Gemini 판단 |
|----|------|------|------------|
| 3-1 | 거실에서 TV 시청 중 | 0~5초 | 정상 |
| 3-2 | 소파에 앉아 차 마시는 중 | 5~10초 | 정상 |
| 3-3 | 일어나서 부엌으로 이동 | 10~15초 | 정상 |

### 이미지 프롬프트

**씬 3-1: TV 시청**
```
A Korean apartment living room viewed from a wall-mounted security camera angle.
An elderly Korean woman sitting comfortably on the sofa watching TV.
The TV screen is glowing. A cup of tea on the low table.
Peaceful, calm atmosphere. Daytime, warm lighting.
Realistic home CCTV footage style, slightly grainy, wide-angle.
```

**씬 3-2: 차 마시기**
```
Same Korean apartment living room from wall-mounted security camera angle.
An elderly Korean woman sitting on the sofa, holding a cup of tea
with both hands, sipping it. She looks relaxed and content.
TV is on in the background. Peaceful domestic scene.
Realistic home CCTV footage, slightly grainy.
```

**씬 3-3: 부엌으로 이동**
```
Same Korean apartment living room from wall-mounted security camera angle.
An elderly Korean woman standing up from the sofa and walking
toward the kitchen doorway. Normal walking pace, steady gait.
She is carrying her empty cup. Calm, everyday movement.
Realistic home CCTV footage style, slightly grainy.
```

### Veo 영상 프롬프트 (씬 3-1 이미지 기반)
```
Home security camera footage of a Korean apartment living room.
An elderly woman is sitting on the sofa watching TV. She picks up
a cup of tea from the table, sips it, and puts it back.
After a while, she stands up and walks toward the kitchen.
Calm, peaceful everyday scene. Fixed camera angle, no camera movement.
Realistic CCTV quality, slightly grainy. 15 seconds duration.
```

---

## 제작 워크플로우

### Step 1: Nano/Banana 이미지 생성
1. 씬 1-1, 1-2, 1-3, 1-4 이미지 생성 (화재 오인)
2. 씬 2-1, 2-2, 2-3, 2-4 이미지 생성 (낙상)
3. 씬 3-1, 3-2, 3-3 이미지 생성 (정상)
4. **핵심**: 같은 배경(아파트)이 일관되게 유지되어야 함 → 씬 1 시리즈는 같은 부엌, 씬 2·3은 같은 거실

### Step 2: 이미지 검수
- 홈캠 시점이 일관적인지 확인
- 같은 시나리오 내 배경이 동일한지 확인
- 어르신 인물이 자연스러운지 확인
- 필요 시 프롬프트 조정 후 재생성

### Step 3: Veo 3.1 영상 생성
- 각 시나리오의 핵심 씬 이미지를 참조 이미지로 사용
- Veo 프롬프트 + 참조 이미지 → 15초 영상 생성
- 총 3개 영상 (화재 오인, 낙상, 정상)

### Step 4: 후처리
- 타임스탬프 오버레이 추가 (HH:MM:SS 형식, 우하단)
- "SafeCall HomeCam" 워터마크 (좌상단, 작게)
- 필요 시 약간의 노이즈/그레인 추가 (홈캠 느낌 강화)

---

## 프롬프트 작성 가이드라인

### 일관성을 위한 공통 키워드
- `wall-mounted security camera angle` — 홈캠 시점
- `Korean apartment` — 한국 아파트
- `elderly Korean woman` — 어르신
- `realistic home CCTV footage style, slightly grainy` — 홈캠 화질
- `wide-angle` — 광각
- `fixed camera angle, no camera movement` — 고정 카메라 (Veo용)

### 주의사항
- 실제 화재/폭발 장면 생성하지 않기 — **수증기/연기**만
- 낙상 장면은 너무 폭력적이지 않게 — 자연스러운 넘어짐
- 인물은 일관되게 (같은 옷, 같은 외모)
- 배경은 시나리오 내에서 동일하게 유지
