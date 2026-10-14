/*
 * 배경음악: 장성고등학교 교가 (문도채 작시, 김정수 작곡). 다장조 4/4박자.
 * 음원 파일 없이 브라우저에서 직접 소리를 만든다.
 * 브라우저는 사용자가 화면을 한 번 누른 뒤에야 소리를 허용하므로, 첫 클릭·키 입력 때 시작한다.
 * 오른쪽 아래 버튼으로 끄고 켤 수 있고, 끈 상태는 기억한다.
 */
(() => {
  const PITCH = { E4: 329.63, F4: 349.23, G4: 392, A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25 };
  // 음마다 [음이름, 박 수]. 쉼표는 음이름을 비운다.
  const ANTHEM = [
    // 보아라 저 하늘 우람한 노령
    ['E4', .75], ['F4', .25], ['G4', 3], ['G4', 1], ['A4', .75], ['B4', .25], ['C5', 2], ['D5', 1.5], ['C5', .5], ['B4', 1], ['A4', 1], ['G4', 3], ['', 1],
    // 선비의 얼 가슴 가득 희망 드높다
    ['A4', 1.5], ['A4', .5], ['G4', 1], ['A4', 1], ['C5', .5], ['B4', 1], ['A4', .5], ['G4', 2], ['A4', 1], ['A4', .75], ['G4', .25], ['A4', 1], ['B4', 1], ['C5', 3], ['', 1],
    // 나라 위한 꿈나무로 한뜻에 모여 바르고 알차게 자라는 우리
    ['E4', .75], ['F4', .25], ['G4', .75], ['G4', .25], ['A4', .75], ['A4', .25], ['G4', .75], ['G4', .25], ['A4', .75], ['C5', .5], ['B4', .5], ['A4', .25], ['G4', 2],
    ['A4', 1], ['A4', .5], ['B4', .5], ['C5', 1], ['B4', .5], ['A4', .5], ['C5', .75], ['C5', .25], ['B4', .5], ['C5', .5], ['D5', 1], ['G4', 1],
    // 천하의 영재들이 이어 갈 모교
    ['E5', 2], ['D5', 2], ['C5', 1], ['B4', .75], ['A4', .25], ['G4', 2], ['A4', 1.5], ['C5', .5], ['B4', 1], ['C5', 1], ['D5', 3], ['', 1],
    // 온 누리에 빛나거라 그 이름 장성고교
    ['G4', 1.5], ['G4', .5], ['E5', 1], ['D5', 1], ['C5', .5], ['B4', 1], ['A4', .5], ['G4', 2], ['A4', 1], ['A4', .75], ['A4', .25], ['G4', .5], ['A4', .5], ['B4', 1], ['C5', 3], ['', 1],
  ];
  const BEAT = 0.56;     // 한 박 (초, 약 107 BPM)
  const REST = 4;        // 한 번 끝나고 다시 시작하기까지 쉬는 박 수
  const AHEAD = 0.4;     // 이만큼 앞서 음을 예약한다 (초)

  let ctx = null, master = null, timer = null, next = 0, at = 0;
  let on = true;
  try { on = localStorage.getItem('bgm') !== '0'; } catch {}

  const btn = document.createElement('button');
  btn.className = 'bgm-toggle';
  btn.type = 'button';
  document.body.appendChild(btn);
  const render = () => {
    const playing = on && ctx && ctx.state === 'running';
    btn.textContent = playing ? '♪ 교가 끄기' : '♪ 교가 듣기';
    btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
  };

  function tone(freq, start, dur, type, vol) {
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(vol, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(gain).connect(master);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  }

  // 앞으로 AHEAD초 안에 시작하는 음을 미리 예약한다
  function schedule() {
    while (at < ctx.currentTime + AHEAD) {
      if (next >= ANTHEM.length) { at += REST * BEAT; next = 0; continue; }
      const [name, beats] = ANTHEM[next++];
      const dur = beats * BEAT;
      if (name) {
        tone(PITCH[name], at, Math.max(0.25, dur * 0.95), 'triangle', 0.22);
        tone(PITCH[name] / 2, at, Math.max(0.25, dur * 0.95), 'sine', 0.1);
      }
      at += dur;
    }
  }

  function start() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) { btn.hidden = true; return; }
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
      next = 0;
      at = ctx.currentTime + 0.1;
    }
    ctx.resume().then(render);
    if (!timer) timer = setInterval(schedule, 100);
  }

  function stop() {
    clearInterval(timer);
    timer = null;
    // 예약해 둔 음까지 끊으려면 컨텍스트를 새로 만든다
    if (ctx) { ctx.close(); ctx = null; }
    render();
  }

  btn.addEventListener('click', () => {
    on = !(on && timer);
    try { localStorage.setItem('bgm', on ? '1' : '0'); } catch {}
    on ? start() : stop();
    render();
  });

  // 버튼을 누른 경우는 위의 click에서 처리한다
  const unlock = (ev) => { if (on && !timer && ev.target !== btn) start(); };
  addEventListener('pointerdown', unlock);
  addEventListener('keydown', unlock);
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    document.hidden ? ctx.suspend() : on && ctx.resume();
  });
  render();
})();
