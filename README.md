# 장성고등학교 20회 2026 풋살컵

🌐 **사이트:** https://yeongseon.github.io/jangseong-highschool-20-futsal/

📦 **저장소:** https://github.com/yeongseon/jangseong-highschool-20-futsal

장성고등학교 20회 졸업생 연례 풋살대회 공식(?) 사이트.

- **2026 경기일:** 2026-10-17
- **장소:** 세종풋살파크
- **경기 방식:** 2팀 · 1경기
- **경기 전:** D-Day, 팀 추천, 라인업 공개
- **경기 후:** 우승팀, 득점왕, 도움왕, MVP
- **풋살컵 회장:** 박준철
- **후원:** FRESH PODO / 신선포도농원
- **Hosting:** GitHub Pages

## 매년 업데이트

대부분의 연도별 변경은 `data.js`에서 관리합니다.

```js
window.JS20_DATA = {
  activeEdition: 2026,
  editions: {
    2026: { /* date, teams, players, awards ... */ }
  }
}
```

다음 해에는 기존 기록을 보존한 채 새 edition을 추가하고 `activeEdition`만 변경합니다.

## 로컬 미리보기

정적 파일이므로 간단한 HTTP 서버로 확인할 수 있습니다.

```bash
python -m http.server 8000
```

Then open http://localhost:8000
