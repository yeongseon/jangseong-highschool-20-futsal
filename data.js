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
      phase: 'post', // pre | live | post
      tagline: '다시 모여, 다시 뛴다.',
      photos: [
        { src: 'photos/2026/05.jpg', caption: '함께 뛴 우리 · 1', alt: '2026년 10월 17일 세종풋살파크에서 주먹을 들고 촬영한 장성고 20회 전체 기념사진' },
        { src: 'photos/2026/06.jpg', caption: '함께 뛴 우리 · 2', alt: '세종풋살파크에서 엄지를 들고 촬영한 장성고 20회 전체 기념사진' },
        { src: 'photos/2026/01.jpg', caption: '한승효팀 · 그린 유니폼 · 1', alt: '그린 유니폼을 입고 나란히 서서 촬영한 한승효팀 여섯 명의 기념사진' },
        { src: 'photos/2026/02.jpg', caption: '한승효팀 · 그린 유니폼 · 2', alt: '그린 유니폼을 입은 한승효팀 여섯 명이 엄지를 들고 촬영한 기념사진' },
        { src: 'photos/2026/03.jpg', caption: '최세호팀 · 레드 가운 · 1', alt: '레드 가운을 입은 최세호팀 여섯 명이 팔짱을 끼고 촬영한 기념사진' },
        { src: 'photos/2026/04.jpg', caption: '최세호팀 · 레드 가운 · 2', alt: '레드 가운을 입은 최세호팀이 풋살장에 나란히 서서 촬영한 기념사진' }
      ],
      teams: [
        { id: 'red', name: '최세호팀', short: '레드 가운', score: null,
          players: ['최세호', '박준철', '김철민', '김동진', '최영선', '최동영'] },
        { id: 'green', name: '한승효팀', short: '그린 유니폼', score: null,
          players: ['한승효', '고재준', '김상명', '김승현', '김현수', '최현석'] }
      ],
      // 단톡방 참석 명단 기준 16명. 사진은 졸업앨범 개인 사진. out('부상' 또는 '결장')이 있으면 흑백으로 표시하고 팀 추천에서 뺀다.
      players: [
        { name: '최영선', photo: 'players/3-7-34.jpg', rating: 1 },
        { name: '공영호', photo: 'players/3-1-01.jpg', rating: 1, joker: true }, // 단톡방 이름 ㄱ영오 · 깍두기
        { name: '고재준', photo: 'players/3-8-02.jpg', rating: 1 },
        { name: '김동진', photo: 'players/3-7-05.jpg', rating: 1 },
        { name: '김상명', photo: 'players/3-8-07.jpg', rating: 1 },
        { name: '김성렬', photo: 'players/3-8-08.jpg', rating: 1, out: '부상' },
        { name: '김승현', photo: 'players/3-8-09.jpg', rating: 1 },
        { name: '김영수', photo: 'players/3-8-10.jpg', rating: 1, out: '결장' },
        { name: '김철민', photo: 'players/3-7-10.jpg', rating: 1 },
        { name: '김현수', photo: 'players/3-8-16.jpg', rating: 1 },
        { name: '박준철', photo: 'players/3-7-16.jpg', rating: 1 },
        { name: '서인원', photo: 'players/3-7-19.jpg', rating: 1, out: '부상' },
        { name: '최동영', photo: 'players/3-7-33.jpg', rating: 1 },
        { name: '최세호', photo: 'players/3-8-37.jpg', rating: 1 },
        { name: '최현석', photo: 'players/3-7-36.jpg', rating: 1 },
        { name: '한승효', photo: 'players/3-1-36.jpg', rating: 1 }
      ],
      // 상품은 모두 쿠팡 1만원권
      prizes: [
        { title: '풋살 승리팀', amount: 90000, note: '쿠팡 1만원권 9장' },
        { title: '풋살 패배팀 득점왕', amount: 10000, note: '쿠팡 1만원권 1장' },
        { title: '퀴즈 승리팀', amount: 90000, note: '쿠팡 1만원권 9장' }
      ],
      awards: {
        champion: '한승효팀',
        goldenBoot: '김동진',
        assistKing: null,
        mvp: '한승효',
        goldenGlove: null
      },
      // 후원해 주신 곳. 모두 같은 크기로 나란히 보여 준다.
      sponsors: [
        { logo: 'sponsors/fresh-podo.png', type: '샤인머스캣 · 포도', name: '신선포도농원', branch: 'FRESH PODO',
          url: 'https://blog.naver.com/fresh_podo' },
        { logo: 'sponsors/deungppyeo.svg', type: '감자탕 · 등갈비', name: '등뼈감자탕&등갈비', branch: '월산점',
          url: 'https://search.naver.com/search.naver?query=%EB%93%B1%EB%BC%88%EA%B0%90%EC%9E%90%ED%83%95%26%EB%93%B1%EA%B0%88%EB%B9%84+%EC%9B%94%EC%82%B0%EC%A0%90' },
        { logo: 'sponsors/deungppyeo.svg', type: '감자탕 · 등갈비', name: '등뼈감자탕&등갈비', branch: '중흥점',
          url: 'https://search.naver.com/search.naver?query=%EB%93%B1%EB%BC%88%EA%B0%90%EC%9E%90%ED%83%95%26%EB%93%B1%EA%B0%88%EB%B9%84+%EC%A4%91%ED%9D%A5%EC%A0%90' },
        { logo: 'sponsors/coco.svg', type: '소아청소년과', name: '코코소아청소년과의원', branch: '',
          url: 'https://short.ddocdoc.com/3i88ju' }
      ],
      // 사이트에 들어오면 뜨는 공지 팝업. 필요 없으면 null.
      notices: [
        {
          id: '2026-han-seunghyo-promotion',
          kicker: '축하합니다',
          title: '한승효 경감 승진',
          photo: 'notice/han-seunghyo-promotion.jpg',
          body: '우리 20회 한승효가 경감으로 승진했습니다.\n2026년 10월 1일(목) 승진임용식'
        },
        {
          id: '2026-kim-sangmyeong-baby',
          kicker: '축하합니다',
          title: '김상명 아빠 됐다',
          photo: 'notice/kim-sangmyeong.png',
          body: '우리 20회 김상명이 아빠가 됐습니다.\n아기와 엄마의 건강을 함께 빌어 줍시다.'
        }
      ],
      noticeFooter: '풋살컵에서 다 같이 축하해 줍시다!',
      president: {
        title: '풋살컵 회장',
        name: '박준철'
      }
    }
  }
};
