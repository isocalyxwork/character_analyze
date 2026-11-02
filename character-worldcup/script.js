/* =====================================================================
   아래부터는 기능 코드 (수정 불필요)
   ===================================================================== */
const $ = id => document.getElementById(id);
let size = ROUND_OPTIONS[0];
let state = null;   // { round, queue, next, picks:[], history:[] }

function slotHTML(src, label){
  return src ? `<img src="${src}" alt="">` : label;
}
function fillSlot(el, src, label){
  el.innerHTML = slotHTML(src, label);
  el.classList.toggle("filled", !!src);
}
function descText(d){ return d ? escapeHTML(d) : `<span class="desc-empty">설명을 입력하세요</span>`; }
function escapeHTML(s){ return String(s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
function shuffle(a){ a=[...a]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
function roundName(n){ return n===2 ? "결승" : `${n}강`; }
function show(id){ document.querySelectorAll(".screen").forEach(s=>s.classList.toggle("active", s.id===id)); window.scrollTo(0,0); }

/* --- 시작 화면 --- */
function renderIntro(){
  $("intro-title").textContent = SITE.title;
  $("intro-desc").innerHTML = escapeHTML(SITE.desc).replace(/\n/g,"<br>");
  fillSlot($("intro-img"), SITE.image, "대표 이미지 자리");
  const valid = ROUND_OPTIONS.filter(n => n <= CHARACTERS.length);
  if (!valid.includes(size)) size = valid[0];
  $("round-pick").innerHTML = valid.map(n =>
    `<button data-n="${n}" class="${n===size?'on':''}">${n}강</button>`).join("");
  $("round-pick").querySelectorAll("button").forEach(b => b.onclick = () => { size = +b.dataset.n; renderIntro(); });
}

/* --- 게임 진행 --- */
function start(){
  state = { round:size, queue:shuffle(CHARACTERS).slice(0,size), next:[], picks:[], history:[], elim:{} };
  renderMatch();
  show("s-match");
}

function renderMatch(){
  const { round, queue, next } = state;
  const a = queue[0], b = queue[1];
  const total = round/2, cur = next.length + 1;
  $("round-label").innerHTML = round===2 ? `<span>결승</span>` : `<span>${round}강</span> ${cur} / ${total}`;
  const done = state.history.length, all = size - 1;
  $("count").textContent = `전체 ${done} / ${all}`;
  $("progress").style.width = (done/all*100) + "%";
  [["pick-a",a],["pick-b",b]].forEach(([id,c])=>{
    const el = $(id);
    el.className = "pick";
    el.innerHTML = `<div class="slot ${c.image?'filled':''}">${slotHTML(c.image,"사진 자리")}</div>
                    <h3>${escapeHTML(c.name)}</h3><p>${descText(c.desc)}</p>`;
    el.onclick = () => choose(c, c===a ? b : a, el);
  });
  $("undo").style.visibility = state.history.length ? "visible" : "hidden";
}

let locked = false;
function choose(win, lose, el){
  if (locked) return;
  locked = true;
  el.classList.add("chosen");
  (el.id==="pick-a" ? $("pick-b") : $("pick-a")).classList.add("lost");
  setTimeout(() => {
    locked = false;
    // 되돌리기를 위해 현재 상태 저장
    state.history.push(JSON.stringify({ round:state.round, queue:state.queue, next:state.next, picks:state.picks, elim:state.elim }));
    state.picks.push({ id:win.id, round:state.round });
    state.elim[lose.id] = state.round;          // 어느 라운드에서 탈락했는지 (순위 계산용)
    state.next.push(win);
    state.queue = state.queue.slice(2);
    if (state.queue.length === 0){
      if (state.next.length === 1){ return finish(win); }
      state.queue = state.next; state.next = []; state.round /= 2;
    }
    renderMatch();
  }, 350);
}

function undo(){
  if (!state.history.length) return;
  const prev = JSON.parse(state.history.pop());
  const byId = Object.fromEntries(CHARACTERS.map(c=>[c.id,c]));
  state.round = prev.round;
  state.queue = prev.queue.map(c=>byId[c.id]);
  state.next  = prev.next.map(c=>byId[c.id]);
  state.picks = prev.picks; state.elim = prev.elim;
  renderMatch();
}

/* --- 결과 계산 --- */
function computeScores(winner){
  const byId = Object.fromEntries(CHARACTERS.map(c=>[c.id,c]));
  const score = Object.fromEntries(AXES.map(a=>[a.key,0]));
  let max = 0;
  state.picks.forEach(p => {
    const w = ROUND_WEIGHT[p.round] ?? 1;
    AXES.forEach(a => score[a.key] += (byId[p.id].traits[a.key]||0) * w);
    max += 2 * w;
  });
  AXES.forEach(a => score[a.key] += (winner.traits[a.key]||0) * WINNER_BONUS);
  max += 2 * WINNER_BONUS;
  return { score, max };
}

function finish(winner){
  const { score, max } = computeScores(winner);
  const code = AXES.map(a => score[a.key] > 0 ? a.right.code : a.left.code).join("");
  const type = RESULT_TYPES[code] || {};

  $("r-code").textContent = code;
  $("r-title").innerHTML = type.title ? escapeHTML(type.title) : `<span class="desc-empty">유형 이름을 입력하세요</span>`;
  $("r-desc").innerHTML = type.desc ? escapeHTML(type.desc) : `<span class="desc-empty">이 유형(${code})에 대한 취향 설명을 입력하세요</span>`;
  fillSlot($("r-type-img"), type.image, "유형 이미지 자리");

  // 축별 막대
  $("r-axes").innerHTML = AXES.map(a => {
    const ratio = Math.max(-1, Math.min(1, score[a.key] / (max||1)));   // -1 ~ 1
    const rightPct = Math.round(50 + ratio*50), leftPct = 100 - rightPct;
    const isRight = score[a.key] > 0;
    const width = Math.abs(ratio)*50;
    const pos = isRight ? `left:50%;width:${width}%` : `right:50%;width:${width}%`;
    return `<div class="axis">
      <div class="axis-labels">
        <span>${isRight?'':'<b>'}${a.left.code} ${a.left.label} ${leftPct}%${isRight?'':'</b>'}</span>
        <span>${isRight?'<b>':''}${rightPct}% ${a.right.label} ${a.right.code}${isRight?'</b>':''}</span>
      </div>
      <div class="axis-track"><i style="${pos}"></i></div>
    </div>`;
  }).join("");

  // 우승 캐릭터
  $("r-winner").innerHTML = `<div class="slot ${winner.image?'filled':''}">${slotHTML(winner.image,"사진 자리")}</div>
    <div><h3>${escapeHTML(winner.name)}</h3><p>${descText(winner.desc)}</p></div>`;

  // TOP 4 : 우승 → 결승 탈락 → 4강 탈락 2명
  const byId = Object.fromEntries(CHARACTERS.map(c=>[c.id,c]));
  const second = Object.keys(state.elim).filter(id=>state.elim[id]===2);
  const semis  = Object.keys(state.elim).filter(id=>state.elim[id]===4);
  const top = [[winner,"우승"], ...second.map(id=>[byId[id],"준우승"]), ...semis.map(id=>[byId[id],"4강"])];
  $("r-rank").innerHTML = top.map(([c,label]) =>
    `<div><div class="slot ${c.image?'filled':''}">${slotHTML(c.image,"사진")}</div><b>${label}</b>${escapeHTML(c.name)}</div>`).join("");

  state.result = { code, title:type.title||"", winner:winner.name };
  show("s-result");
}

/* --- 버튼 연결 --- */
$("start").onclick = start;
$("undo").onclick = undo;
$("retry").onclick = () => { renderIntro(); show("s-intro"); };
$("copy").onclick = async () => {
  const r = state.result;
  const text = `[${SITE.title}] 나의 취향 유형은 ${r.code}${r.title?` (${r.title})`:""}! 최종 우승: ${r.winner}`;
  try { await navigator.clipboard.writeText(text); toast("결과가 복사되었어요"); }
  catch { toast("복사에 실패했어요"); }
};
function toast(msg){ const t=$("toast"); t.textContent=msg; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),1600); }

renderIntro();
