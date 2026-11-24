(() => {
  const PRICE = 280, SHIP = 60;
  const q = { g: 0, c: 0 };
  const $ = id => document.getElementById(id);
  const fmt = n => 'NT$' + n.toLocaleString('en-US');
  const gift = $('gift'), copyBtn = $('copy'), toast = $('toast');

  // 托盤：節點建一次、之後只改 class，顏色過場才跑得動；新袋子照點擊順序排在最後
  const CAP = 10, order = [];
  const slotsEl = $('slots');
  const mk = (t) => `<span class="mk">${t}</span>`;
  slotsEl.innerHTML =
    Array.from({ length: CAP }, (_, i) => `<span class="slot"><span class="b"></span>${i === 2 ? mk('免運') : i === 4 ? mk('滿 5') : ''}</span>`).join('') +
    '<span class="more" hidden></span><span class="plus">+</span>' +
    `<span class="slot free"><span class="t">送</span><span class="b"></span>${mk('送 1')}</span>`;
  const slots = [...slotsEl.querySelectorAll('.slot:not(.free)')];
  const more = slotsEl.querySelector('.more'), plus = slotsEl.querySelector('.plus');
  const free = slotsEl.querySelector('.slot.free'), freeB = free.querySelector('.b'),
        freeT = free.querySelector('.t'), freeMk = free.querySelector('.mk');
  const replay = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
  let prevN = 0;

  function drawTray(added) {
    const n = q.g + q.c;
    const shown = Math.max(5, Math.min(n, CAP));
    slots.forEach((sl, i) => {
      sl.hidden = i >= shown;
      const b = sl.firstChild, k = order[i];
      b.className = 'b' + (k ? ' on ' + k : '');
      if (added && i === n - 1 && i < CAP) replay(b, 'new');
      const m = sl.querySelector('.mk');
      if (m) m.classList.toggle('hit', n >= (i === 2 ? 3 : 5));
    });
    more.hidden = n <= CAP; more.textContent = '+' + (n - CAP);
    const giftOk = n >= 5 && n < 10;
    plus.hidden = free.hidden = n >= 10;
    const gk = document.querySelector('input[name=gift]:checked').value === '爆蒜' ? 'g' : 'c';
    freeB.className = 'b' + (giftOk ? ' on ' + gk : '');
    freeT.classList.toggle('gone', giftOk);
    freeMk.textContent = giftOk ? '贈品' : '送 1';
    freeMk.classList.toggle('hit', giftOk);
    if (giftOk && prevN < 5) replay(freeB, 'stamp');
    prevN = n;
  }

  function render() {
    const n = q.g + q.c;
    document.querySelectorAll('.stepper').forEach(s => {
      const k = s.dataset.k;
      s.querySelector('output').textContent = q[k];
      s.querySelector('[data-d="-1"]').disabled = q[k] === 0;
      s.querySelector('[data-d="1"]').disabled = q[k] >= 30;
    });
    const sub = n * PRICE;
    const ship = n === 0 ? 0 : (n >= 3 ? 0 : SHIP);
    const bonus = n >= 5 && n < 10;
    $('b-n').textContent = n;
    $('b-sub').textContent = fmt(sub);
    $('b-ship').textContent = n === 0 ? '—' : (ship ? fmt(ship) : '免運');
    $('b-ship-row').classList.toggle('free', n >= 3);
    $('b-gift-row').classList.toggle('on', bonus);
    gift.classList.toggle('on', bonus);
    gift.inert = !bonus;
    const total = $('b-total');
    total.textContent = fmt(sub + ship);
    total.classList.remove('pop'); void total.offsetWidth; total.classList.add('pop');

    const msg = $('b-msg');
    msg.classList.remove('ok');
    if (n === 0) msg.textContent = '先選口味和數量吧！';
    else if (n < 3) msg.textContent = `再加 ${3 - n} 包就免運，立省 60 元。`;
    else if (n < 5) { msg.textContent = `已經免運！再加 ${5 - n} 包，小姑姑多送你 1 包。`; msg.classList.add('ok'); }
    else if (n < 10) { msg.textContent = '買 5 送 1 成立，免運又多 1 包！'; msg.classList.add('ok'); }
    else { msg.textContent = '10 包以上的大量團購，請直接問小姑姑怎麼送。'; msg.classList.add('ok'); }
    toast.textContent = ''; toast.classList.remove('warn');
    copyBtn.classList.remove('done');
  }

  document.querySelectorAll('.stepper button').forEach(b => b.addEventListener('click', () => {
    const k = b.closest('.stepper').dataset.k;
    const d = Number(b.dataset.d);
    if (d > 0 && q[k] >= 30) return;
    if (d < 0 && q[k] === 0) return;
    q[k] += d;
    if (d > 0) order.push(k); else order.splice(order.lastIndexOf(k), 1);
    render();
    drawTray(d > 0);
  }));

  function orderText() {
    const n = q.g + q.c, ship = n >= 3 ? 0 : SHIP;
    const lines = ['小姑姑你好，我想訂購花生脆糖：'];
    if (q.g) lines.push(`・爆蒜花生脆糖 ${q.g} 包`);
    if (q.c) lines.push(`・鮮香菜花生脆糖 ${q.c} 包`);
    if (n >= 5 && n < 10) lines.push(`・加贈 1 包：${document.querySelector('input[name=gift]:checked').value}`);
    if (n >= 10) lines.push('・大量團購，想請問贈品怎麼算');
    lines.push(`運費：${ship ? ship + ' 元' : '免運'}`);
    lines.push(`合計：${fmt(n * PRICE + ship)}`);
    return lines.join('\n');
  }

  let toastTimer;
  function say(t, warn) {
    clearTimeout(toastTimer);
    toast.textContent = t; toast.classList.toggle('warn', !!warn);
    if (!warn) toastTimer = setTimeout(() => { toast.textContent = ''; }, 4000);
  }

  copyBtn.addEventListener('click', async () => {
    if (q.g + q.c === 0) { say('還沒選口味喔！先按 ＋ 選幾包，再複製。', true); document.querySelector('.stepper button[data-d="1"]').focus(); return; }
    const text = orderText();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch {}
      ta.remove();
    }
    say('已複製！貼上傳給小姑姑就可以了。');
    copyBtn.classList.add('done');
    clearTimeout(copyBtn._t); copyBtn._t = setTimeout(() => copyBtn.classList.remove('done'), 2500);
  });

  // 手機底部下單列：過了開場才出現，到價格區就收起
  const dock = $('dock');
  if (dock && 'IntersectionObserver' in window) {
    const seen = { hero: true, order: false };
    const sync = () => {
      const on = !seen.hero && !seen.order;
      dock.classList.toggle('show', on);
      dock.setAttribute('aria-hidden', String(!on));
      dock.querySelector('a').tabIndex = on ? 0 : -1;
    };
    new IntersectionObserver(es => es.forEach(e => {
      seen[e.target.id === 'order' ? 'order' : 'hero'] = e.isIntersecting; sync();
    })).observe(document.querySelector('.hero'));
    new IntersectionObserver(es => es.forEach(e => { seen.order = e.isIntersecting; sync(); }))
      .observe(document.getElementById('order'));
  }

  gift.addEventListener('change', () => { toast.textContent = ''; drawTray(false); });
  render();
  drawTray(false);
})();
