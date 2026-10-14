/*
 * JS20 FUTSAL CUP — annual data file
 * Update this file each year; the UI reads only window.JS20_DATA.
 */
window.JS20_DATA = {
  activeEdition: 2026,
  editions: {
    2026: {
      year: 2026,
      dateLabel: '2026년 10월 17일',
      dateISO: '2026-10-17',
      kickoff: '미정',
      venue: '세종풋살파크',
      phase: 'pre', // pre | live | post
      tagline: '다시 모여, 다시 뛴다.',
      teams: [
        { id: 'green', name: '그린팀', short: 'GREEN', score: null },
        { id: 'white', name: '화이트팀', short: 'WHITE', score: null }
      ],
      // 참석자 16명 (단톡방 참석 명단 기준)
      players: [
        { name: '최영선', rating: 1 },
        { name: '공영호', rating: 1 }, // 단톡방 이름 ㄱ영오
        { name: '고재준', rating: 1 },
        { name: '김동진', rating: 1 },
        { name: '김상명', rating: 1 },
        { name: '김성렬', rating: 1 },
        { name: '김승현', rating: 1 },
        { name: '김영수', rating: 1 },
        { name: '김철민', rating: 1 },
        { name: '김현수', rating: 1 },
        { name: '박준철', rating: 1 },
        { name: '서인원', rating: 1 },
        { name: '최동영', rating: 1 },
        { name: '최세호', rating: 1 },
        { name: '최현석', rating: 1 },
        { name: '한승효', rating: 1 }
      ],
      awards: {
        champion: null,
        goldenBoot: null,
        assistKing: null,
        mvp: null,
        goldenGlove: null
      },
      sponsor: {
        name: '신선포도농원',
        brand: 'FRESH PODO',
        url: 'https://m.smartstore.naver.com/fresh_podo'
      },
      president: {
        title: '풋살컵 회장',
        name: '박준철'
      }
    }
  }
};
