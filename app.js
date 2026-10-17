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
  set('draftTeamA', e.teams[0].name);
  set('draftTeamB', e.teams[1].name);
  set('matchKickoff', e.kickoff || '미정');
  set('matchVenue', e.venue || '세종풋살파크');
  set('matchDate', e.dateLabel.replace(String(e.year), '').trim());
  if (e.teams.every(team => Number.isFinite(team.score))) {
    set('matchScore', `${e.teams[0].score} : ${e.teams[1].score}`);
    $('matchScore').setAttribute('aria-label', e.teams.map(team => `${team.name} ${team.score}점`).join(', '));
  }
  if (e.setsPlayed) {
    set('matchFormat', `2팀 · ${e.setsPlayed}세트`);
    set('matchSets', `${e.setsPlayed}세트 합산`);
    $('matchSets').hidden = false;
  }

  const status = e.phase === 'post' ? '경기 종료' : e.phase === 'live' ? '경기 중' : '경기 예정';
  set('statusPill', status);

  const photos = Array.isArray(e.photos) ? e.photos : [];
  const photoGrid = $('photoGrid');
  if (photoGrid && photos.length) {
    photos.forEach(photo => {
      const figure = document.createElement('figure');
      figure.className = 'photo-card reveal';
      const link = document.createElement('a');
      link.href = `./${photo.src}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', `${photo.caption} 크게 보기 (새 탭)`);
      const img = document.createElement('img');
      img.src = `./${photo.src}`;
      img.alt = photo.alt;
      img.width = 1200;
      img.height = 1600;
      img.loading = 'lazy';
      img.decoding = 'async';
      const caption = document.createElement('figcaption');
      caption.textContent = photo.caption;
      link.appendChild(img);
      figure.append(link, caption);
      photoGrid.appendChild(figure);
    });
    $('photos').hidden = false;
  } else {
    document.querySelector('.nav a[href="#photos"]')?.remove();
  }

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
  if (e.phase === 'post') {
    document.querySelector('.countdown-kicker').textContent = '경기 종료';
    document.querySelector('#countdown > span:last-child').textContent = '함께 뛴 하루';
    document.querySelector('.edition-card p').textContent = `${e.dateLabel} · 경기 종료`;
    document.querySelectorAll('.team p').forEach((el, i) => {
      el.textContent = e.awards.champion === e.teams[i].name ? '우승' : '함께 뛴 팀';
    });
    if (!e.kickoff || e.kickoff === '미정') document.querySelector('.match-time').hidden = true;
  }

  const sponsors = Array.isArray(e.sponsors) ? e.sponsors : [];
  const sponsorList = $('sponsorList');
  if (sponsorList && sponsors.length) {
    sponsorList.innerHTML = sponsors.map(s => `
      <a class="sponsor-card" href="${s.url}" target="_blank" rel="noopener noreferrer">
        ${s.logo ? `<img class="sponsor-icon" src="./${s.logo}" alt="" loading="lazy" />` : `<span class="sponsor-icon" aria-hidden="true">${s.icon || '◆'}</span>`}
        <div><small>${s.type}</small><strong>${s.name}</strong>${s.branch ? `<em>${s.branch}</em>` : ''}</div>
        <b>↗</b>
      </a>`).join('');
  } else $('sponsorMore')?.remove();

  const awards = [
    ['champion', 0, '우승'], ['goldenBoot', 1, '득점왕'], ['assistKing', 2, '도움왕'],
    ['mvp', 3, 'MVP'], ['applause', 4, '박수상']
  ];
  const cards = Array.from(document.querySelectorAll('.award-card b'));
  awards.forEach(([key, i]) => { if (e.awards[key]) cards[i].textContent = e.awards[key]; });
  set('awardNote', awards.filter(([key]) => e.awards[key] != null)
    .map(([key, , label]) => `${label} · ${e.awards[key]}`).join(' / '));

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
  const roster = Array.isArray(e.players) ? e.players : [];
  const activePlayers = roster.filter(p => !p.out);
  const jokers = activePlayers.filter(p => p.joker);
  const players = activePlayers.filter(p => !p.joker); // 부상·결장 선수와 깍두기는 고정 팀 편성에서 뺀다
  const jokerNote = jokers.length ? ` · 깍두기: ${jokers.map(p => p.name).join(', ')}` : '';
  const confirmedTeams = e.teams.every(team => Array.isArray(team.players))
    ? e.teams.map(team => team.players.map(name => players.find(p => p.name === name)).filter(Boolean))
    : null;
  if (confirmedTeams) {
    renderSquads(confirmedTeams);
    document.querySelectorAll('.draft-side').forEach((side, i) => {
      side.innerHTML = `<b>${e.teams[i].name}</b>${confirmedTeams[i].map(p => `<span>${p.name}</span>`).join('')}`;
    });
    draftButton.textContent = '확정 라인업 보기 ↘';
    draftMessage.textContent = `${e.teams.map((team, i) => `${team.name} ${confirmedTeams[i].length}명`).join(' · ')}${jokerNote}`;
    draftButton.addEventListener('click', () => $('squads').scrollIntoView({ behavior:'smooth' }));
  } else if (!players.length) {
    draftButton.disabled = false;
    draftButton.addEventListener('click', () => {
      draftMessage.textContent = '라인업 대기 중 — 선수 명단이 들어오면 실제 팀 추천을 실행합니다.';
      draftButton.textContent = '선수 명단 준비 중';
      setTimeout(() => { draftButton.innerHTML = '팀 추천하기 <span>↻</span>'; }, 1700);
    });
  } else {
    draftMessage.textContent = `${players.length}명 팀 편성${jokerNote} · 클릭할 때마다 밸런스를 다시 계산합니다.`;
    renderRoster();
    draftButton.addEventListener('click', () => {
      const shuffled = [...players].sort(() => Math.random() - .5);
      const teams = [[], []], totals = [0, 0];
      shuffled.sort((a,b) => (b.rating || 1) - (a.rating || 1));
      shuffled.forEach(p => {
        const t = totals[0] <= totals[1] ? 0 : 1;
        teams[t].push(p); totals[t] += p.rating || 1;
      });
      draftMessage.textContent = `추천 완료 · ${e.teams[0].name} ${totals[0]} : ${e.teams[1].name} ${totals[1]}${jokerNote} · 최종 확정 전 다시 추천할 수 있습니다.`;
      renderSquads(teams);
      document.querySelector('#squads').scrollIntoView({ behavior:'smooth' });
    });
  }

  // 팀을 나누기 전에는 참석자 전체 명단을 보여 준다
  function renderRoster() {
    const board = $('squadBoard');
    const byName = (a, b) => a.name.localeCompare(b.name, 'ko');
    const sorted = [...activePlayers].sort(byName).concat(roster.filter(p => p.out).sort(byName));
    const outCount = roster.length - activePlayers.length;
    board.innerHTML = `
      <div class="roster">
        <div class="roster-head"><b>참석자 ${activePlayers.length}명${outCount ? ` · 부상·결장 ${outCount}명` : ''}</b><span>팀 추천 후 팀별 라인업이 공개됩니다</span></div>
        <ol class="roster-list">${sorted.map((p, i) => `<li${p.out ? ' class="out"' : ''}>${face(p)}<i>${p.out ? 'OUT' : String(i + 1).padStart(2, '0')}</i>${p.name}${p.joker ? '<em class="joker-tag">깍두기</em>' : ''}${p.out ? `<em class="out-tag${p.out === '부상' ? '' : ' plain'}">${p.out === '부상' ? '🚑 ' : ''}${p.out}</em>` : ''}</li>`).join('')}</ol>
      </div>`;
  }

  function face(p) {
    if (!p.photo) return '';
    const img = `<img class="face" src="./${p.photo}" alt="" loading="lazy" />`;
    return p.out ? `<span class="face-out" title="${p.out}">${img}${p.out === '부상' ? '<b aria-hidden="true">+</b>' : ''}</span>` : img;
  }

  function renderSquads(teams) {
    const board = $('squadBoard');
    board.innerHTML = teams.map((team, idx) => `
      <article class="squad-team ${e.teams[idx].id}">
        <h3>${e.teams[idx].name}${e.awards.champion === e.teams[idx].name ? ' · 우승' : ''}</h3>
        <p>${e.teams[idx].short} · ${team.length}명</p>
        <ol class="squad-players">${team.map(p => `<li>${face(p)}<b>${p.name}</b></li>`).join('')}</ol>
      </article>`).join('');
    const separate = roster.filter(p => p.joker || p.out);
    if (separate.length) {
      board.innerHTML += `<div class="squad-status"><h3>깍두기 · 부상 · 결장</h3><ul class="roster-list">${separate.map(p => `<li${p.out ? ' class="out"' : ''}>${face(p)}${p.name}<em class="${p.joker ? 'joker-tag' : `out-tag${p.out === '부상' ? '' : ' plain'}`}">${p.joker ? '깍두기' : p.out}</em></li>`).join('')}</ul></div>`;
    }
    board.classList.add('has-teams');
  }

  // 공지 팝업. '오늘 하루 보지 않기'를 누르면 그날(한국 시간)은 다시 띄우지 않는다.
  const notices = e.notices || [];
  const hideKey = `notice-hidden:${notices.map(n => n.id).join('+')}`;
  let hiddenOn = null;
  try { hiddenOn = localStorage.getItem(hideKey); } catch {}
  if (notices.length && hiddenOn !== todayISO) {
    const modal = document.createElement('div');
    modal.className = 'notice';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', '공지사항');
    const esc = (t) => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
    modal.innerHTML = `
      <div class="notice-card${notices.length > 1 ? ' multi' : ''}">
        <button class="notice-x" type="button" aria-label="닫기">×</button>
        ${notices.map(n => `
          <section class="notice-item">
            <span class="notice-kicker">🎉 ${esc(n.kicker)}</span>
            ${n.photo ? `<img class="notice-photo" src="./${n.photo}" alt="" />` : ''}
            ${n.emoji ? `<div class="notice-photo notice-emoji" aria-hidden="true">${esc(n.emoji)}</div>` : ''}
            <h3>${esc(n.title)}</h3>
            <p>${esc(n.body).replace(/\n/g, '<br/>')}</p>
          </section>`).join('')}
        ${e.noticeFooter ? `<p class="notice-footer">${esc(e.noticeFooter)}</p>` : ''}
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
    modal.querySelector('.notice-close').focus({ preventScroll: true });
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
  }, { threshold:.12 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();
