(() => {
  const root = window.JS20_DATA;
  if (!root) return;
  const year = root.activeEdition;
  const e = root.editions[year];
  const $ = (id) => document.getElementById(id);
  const set = (id, value) => { const el = $(id); if (el && value != null) el.textContent = value; };

  set('editionYear', e.year);
  set('heroYear', e.year);
  set('footerYear', e.year);
  set('dateLabel', e.dateLabel);
  set('kickoff', e.kickoff || '미정');
  set('tagline', e.tagline);
  set('teamAName', e.teams[0].name);
  set('teamBName', e.teams[1].name);
  set('teamACode', e.teams[0].short);
  set('teamBCode', e.teams[1].short);
  set('matchKickoff', e.kickoff || '미정');
  set('matchVenue', e.venue || '세종풋살파크');
  set('matchDate', e.dateLabel.replace(String(e.year), '').trim());

  const status = e.phase === 'post' ? '경기 종료' : e.phase === 'live' ? '경기 중' : '경기 예정';
  set('statusPill', status);

  // Calendar-day D-Day calculation in Korea Standard Time (Asia/Seoul).
  // This keeps the count stable for the whole local day on static GitHub Pages.
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date());
  const pick = (type) => parts.find(p => p.type === type)?.value;
  const todayISO = `${pick('year')}-${pick('month')}-${pick('day')}`;
  const target = new Date(`${e.dateISO}T00:00:00+09:00`).getTime();
  const today = new Date(`${todayISO}T00:00:00+09:00`).getTime();
  const days = Math.round((target - today) / 86400000);
  const dday = e.phase === 'post'
    ? 'FULL TIME'
    : days === 0
      ? 'D-DAY'
      : days > 0
        ? `D-${days}`
        : `D+${Math.abs(days)}`;
  set('daysLeft', dday);

  const sponsorLink = $('sponsorLink');
  if (sponsorLink) sponsorLink.href = e.sponsor.url;
  const sponsors = Array.isArray(e.sponsors) ? e.sponsors : [];
  const sponsorList = $('sponsorList');
  if (sponsorList && sponsors.length) {
    sponsorList.innerHTML = sponsors.map(s => `
      <a class="sponsor-card" href="${s.url}" target="_blank" rel="noopener noreferrer">
        <span class="sponsor-icon" aria-hidden="true">${s.icon || '◆'}</span>
        <div><small>${s.type}</small><strong>${s.name}</strong>${s.branch ? `<em>${s.branch}</em>` : ''}</div>
        <b>↗</b>
      </a>`).join('');
  } else $('sponsorMore')?.remove();

  const awards = [
    ['champion', 0], ['goldenBoot', 1], ['assistKing', 2], ['mvp', 3]
  ];
  const cards = Array.from(document.querySelectorAll('.award-card b'));
  awards.forEach(([key, i]) => { if (e.awards[key]) cards[i].textContent = e.awards[key]; });

  const prizes = Array.isArray(e.prizes) ? e.prizes : [];
  const prizeBoard = $('prizeBoard');
  if (prizeBoard && prizes.length) {
    const won = (n) => `${(n / 10000).toLocaleString('ko-KR')}만원`;
    prizeBoard.innerHTML = `
      <div class="prize-head"><b>상품</b><span>쿠팡 상품권 · 총 ${won(prizes.reduce((sum, p) => sum + p.amount, 0))}</span></div>
      <div class="prize-list">${prizes.map(p => `
        <div class="prize"><small>${p.title}</small><b>${won(p.amount)}</b><p>${p.note}</p></div>`).join('')}
      </div>`;
  } else if (prizeBoard) prizeBoard.remove();

  const draftButton = $('draftButton');
  const draftMessage = $('draftMessage');
  const players = Array.isArray(e.players) ? e.players : [];
  if (!players.length) {
    draftButton.disabled = false;
    draftButton.addEventListener('click', () => {
      draftMessage.textContent = '라인업 대기 중 — 선수 명단이 들어오면 실제 팀 추천을 실행합니다.';
      draftButton.textContent = '선수 명단 준비 중';
      setTimeout(() => { draftButton.innerHTML = '팀 추천하기 <span>↻</span>'; }, 1700);
    });
  } else {
    draftMessage.textContent = `${players.length}명 준비 완료 · 클릭할 때마다 밸런스를 다시 계산합니다.`;
    renderRoster();
    draftButton.addEventListener('click', () => {
      const shuffled = [...players].sort(() => Math.random() - .5);
      const teams = [[], []], totals = [0, 0];
      shuffled.sort((a,b) => (b.rating || 1) - (a.rating || 1));
      shuffled.forEach(p => {
        const t = totals[0] <= totals[1] ? 0 : 1;
        teams[t].push(p); totals[t] += p.rating || 1;
      });
      draftMessage.textContent = `추천 완료 · 그린팀 ${totals[0]} : 화이트팀 ${totals[1]} · 최종 확정 전 다시 추천할 수 있습니다.`;
      renderSquads(teams);
      document.querySelector('#squads').scrollIntoView({ behavior:'smooth' });
    });
  }

  // 팀을 나누기 전에는 참석자 전체 명단을 보여 준다
  function renderRoster() {
    const board = $('squadBoard');
    const sorted = [...players].sort((a, b) => a.name.localeCompare(b.name, 'ko'));
    board.innerHTML = `
      <div class="roster">
        <div class="roster-head"><b>참석자 ${sorted.length}명</b><span>팀 추천 후 팀별 라인업이 공개됩니다</span></div>
        <ol class="roster-list">${sorted.map((p, i) => `<li>${face(p)}<i>${String(i + 1).padStart(2, '0')}</i>${p.name}</li>`).join('')}</ol>
      </div>`;
  }

  function face(p) {
    return p.photo ? `<img class="face" src="./${p.photo}" alt="" loading="lazy" />` : '';
  }

  function renderSquads(teams) {
    const board = $('squadBoard');
    board.innerHTML = teams.map((team, idx) => `
      <div style="padding:28px;min-width:0;">
        <div style="font:900 12px/1 Arial;letter-spacing:2px;color:${idx===0?'#b9ff4b':'#fff'};margin-bottom:18px">${idx===0?'그린팀':'화이트팀'}</div>
        ${team.map((p,n)=>`<div style="display:flex;justify-content:space-between;align-items:center;gap:18px;padding:11px 0;border-top:1px solid rgba(255,255,255,.12);font-size:13px"><b>${String(n+1).padStart(2,'0')}</b><span style="display:flex;align-items:center;gap:12px">${face(p)}${p.name}</span></div>`).join('')}
      </div>`).join('');
    board.style.gridTemplateColumns = '1fr 1fr';
    board.style.placeItems = 'stretch';
  }

  // 공지 팝업. '오늘 하루 보지 않기'를 누르면 그날(한국 시간)은 다시 띄우지 않는다.
  const notice = e.notice;
  const hideKey = notice && `notice-hidden:${notice.id}`;
  let hiddenOn = null;
  try { hiddenOn = notice && localStorage.getItem(hideKey); } catch {}
  if (notice && hiddenOn !== todayISO) {
    const modal = document.createElement('div');
    modal.className = 'notice';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'noticeTitle');
    const esc = (t) => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
    modal.innerHTML = `
      <div class="notice-card">
        <button class="notice-x" type="button" aria-label="닫기">×</button>
        <span class="notice-kicker">🎉 ${esc(notice.kicker)}</span>
        ${notice.photo ? `<img class="notice-photo" src="./${notice.photo}" alt="" />` : ''}
        <h3 id="noticeTitle">${esc(notice.title)}</h3>
        <p>${esc(notice.body).replace(/\n/g, '<br/>')}</p>
        ${notice.footer ? `<p class="notice-footer">${esc(notice.footer)}</p>` : ''}
        <div class="notice-actions">
          <button class="notice-today" type="button">오늘 하루 보지 않기</button>
          <button class="notice-close" type="button">닫기</button>
        </div>
      </div>`;
    const close = () => { modal.remove(); document.removeEventListener('keydown', onKey); };
    const onKey = (ev) => { if (ev.key === 'Escape') close(); };
    modal.addEventListener('click', (ev) => { if (ev.target === modal) close(); });
    modal.querySelector('.notice-x').addEventListener('click', close);
    modal.querySelector('.notice-close').addEventListener('click', close);
    modal.querySelector('.notice-today').addEventListener('click', () => {
      try { localStorage.setItem(hideKey, todayISO); } catch {}
      close();
    });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(modal);
    modal.querySelector('.notice-close').focus();
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
  }, { threshold:.12 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();
