(() => {
  const state = { cells: [], relations: [], gestures: [], selectedId: null, mode: 'all' };
  const mapEl = document.getElementById('system-map');
  const detailsTitle = document.getElementById('details-title');
  const detailsShort = document.getElementById('details-short');
  const detailsBody = document.getElementById('details-body');
  const tooltip = document.getElementById('tooltip');
  const gestureSpace = document.getElementById('gesture-space');
  const matrix = document.getElementById('gesture-matrix');
  const search = document.getElementById('combo-search');
  const stats = document.getElementById('registry-stats');
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');

  const esc = (s='') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  Promise.all([
    fetch('./data/cells.json').then(r => r.json()),
    fetch('./data/relations.json').then(r => r.json()),
    fetch('./data/gestures.json').then(r => r.json())
  ]).then(([cells, relations, gestures]) => {
    state.cells = cells;
    state.relations = relations;
    state.gestures = gestures.assignments || [];
    renderMap();
    renderMatrix();
  }).catch(err => {
    mapEl.innerHTML = '<p>Не удалось загрузить данные документации.</p>';
    console.error(err);
  });

  function renderMap() {
    mapEl.innerHTML = '';
    state.cells.forEach(cell => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'map-cell';
      b.dataset.id = cell.id;
      b.dataset.kind = cell.kind || 'core';
      b.dataset.status = cell.status || 'documented';
      b.innerHTML = `
        <span class="cell-kicker">${esc(cell.group || '')}</span>
        <span class="cell-title">${esc(cell.title)}</span>
        <span class="cell-short">${esc(cell.short)}</span>
        <span class="cell-next">${esc(cell.code || cell.id)}</span>`;
      b.addEventListener('click', () => selectCell(cell.id));
      b.addEventListener('mouseenter', e => showTooltip(e, cell.short));
      b.addEventListener('mousemove', moveTooltip);
      b.addEventListener('mouseleave', hideTooltip);
      b.addEventListener('focus', e => showTooltip(e, cell.short));
      b.addEventListener('blur', hideTooltip);
      mapEl.appendChild(b);
    });
    applyMode();
  }

  function selectCell(id) {
    state.selectedId = id;
    const cell = state.cells.find(c => c.id === id);
    if (!cell) return;
    document.querySelectorAll('.map-cell').forEach(el => el.classList.remove('selected','related','dimmed'));
    const selected = document.querySelector(`.map-cell[data-id="${CSS.escape(id)}"]`);
    if (selected) selected.classList.add('selected');

    const relatedIds = new Set();
    state.relations.forEach(r => {
      if (r.from === id) relatedIds.add(r.to);
      if (r.to === id) relatedIds.add(r.from);
    });
    document.querySelectorAll('.map-cell').forEach(el => {
      if (el.dataset.id !== id) {
        if (relatedIds.has(el.dataset.id)) el.classList.add('related');
        else el.classList.add('dimmed');
      }
    });

    detailsTitle.textContent = cell.title;
    detailsShort.textContent = cell.short;
    const params = Object.entries(cell.parameters || {});
    detailsBody.innerHTML = `
      <div class="details-description">${esc(cell.description)}</div>
      <div class="detail-grid">
        <div class="detail-item"><b>ТИП</b>${esc(cell.kind || 'core')}</div>
        <div class="detail-item"><b>СТАТУС</b>${esc(cell.status || 'documented')}</div>
        ${params.map(([k,v]) => `<div class="detail-item"><b>${esc(k)}</b>${esc(v)}</div>`).join('')}
      </div>
      <div class="detail-tags">${(cell.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>`;
  }

  function applyMode() {
    document.querySelectorAll('.map-cell').forEach(el => {
      const kind = el.dataset.kind;
      el.hidden = state.mode !== 'all' && kind !== state.mode && !(state.mode !== 'core' && kind === 'core');
    });
  }

  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.mode = btn.dataset.mode;
      document.querySelectorAll('.mode-btn').forEach(x => x.classList.toggle('active', x === btn));
      state.selectedId = null;
      renderMap();
    });
  });

  document.getElementById('open-gesture-space').addEventListener('click', () => {
    gestureSpace.hidden = false;
    gestureSpace.scrollIntoView({behavior:'smooth', block:'start'});
  });
  document.getElementById('close-gesture-space').addEventListener('click', () => {
    gestureSpace.hidden = true;
  });

  function renderMatrix() {
    const byCombo = new Map(state.gestures.map(x => [x.combo.toUpperCase(), x]));
    let html = '<thead><tr><th></th>' + alphabet.map(c => `<th>${c}</th>`).join('') + '</tr></thead><tbody>';
    alphabet.forEach(a => {
      html += `<tr><th class="rowhead">${a}</th>`;
      alphabet.forEach(b => {
        const combo = a + b;
        if (a === b) {
          html += '<td><button class="combo-btn disabled" type="button" disabled>—</button></td>';
          return;
        }
        const item = byCombo.get(combo);
        const cls = item ? (item.type === 'system' ? 'system' : 'user') : '';
        html += `<td><button class="combo-btn ${cls}" type="button" data-combo="${combo}" title="${combo}">${combo}</button></td>`;
      });
      html += '</tr>';
    });
    html += '</tbody>';
    matrix.innerHTML = html;
    matrix.querySelectorAll('.combo-btn[data-combo]').forEach(btn => {
      btn.addEventListener('click', () => showCombo(btn.dataset.combo, byCombo.get(btn.dataset.combo)));
    });
    updateStats();
  }

  function showCombo(combo, item) {
    matrix.querySelectorAll('.combo-btn').forEach(x => x.classList.toggle('match', x.dataset.combo === combo));
    detailsTitle.textContent = combo;
    if (!item) {
      detailsShort.textContent = 'Свободная комбинация';
      detailsBody.innerHTML = '<div class="details-description">Комбинация пока не назначена ни системному, ни пользовательскому действию.</div><div class="detail-grid"><div class="detail-item"><b>ТИП</b>free</div><div class="detail-item"><b>РЕДАКТИРОВАНИЕ</b>разрешено</div></div>';
    } else {
      detailsShort.textContent = item.title || item.action || combo;
      detailsBody.innerHTML = `<div class="details-description">${esc(item.description || '')}</div>
        <div class="detail-grid">
          <div class="detail-item"><b>ТИП</b>${esc(item.type)}</div>
          <div class="detail-item"><b>ДЕЙСТВИЕ</b>${esc(item.action || '')}</div>
          <div class="detail-item"><b>РЕДАКТИРОВАНИЕ</b>${item.editable ? 'разрешено' : 'запрещено'}</div>
          <div class="detail-item"><b>СТАТУС</b>${esc(item.status || 'documented')}</div>
        </div>`;
    }
  }

  function updateStats() {
    const sys = state.gestures.filter(x => x.type === 'system').length;
    const usr = state.gestures.filter(x => x.type === 'user').length;
    stats.textContent = `System: ${sys} · User: ${usr} · Free: ${1260 - sys - usr}`;
  }

  search.addEventListener('input', () => {
    const q = search.value.trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,2);
    search.value = q;
    matrix.querySelectorAll('.combo-btn[data-combo]').forEach(x => x.classList.toggle('match', q.length === 2 && x.dataset.combo === q));
    if (q.length === 2) {
      const item = state.gestures.find(x => x.combo.toUpperCase() === q);
      showCombo(q, item);
    }
  });

  function showTooltip(e, text) {
    if (!text) return;
    tooltip.textContent = text;
    tooltip.hidden = false;
    moveTooltip(e);
  }
  function moveTooltip(e) {
    const x = e.clientX ?? e.target.getBoundingClientRect().left;
    const y = e.clientY ?? e.target.getBoundingClientRect().bottom;
    tooltip.style.left = Math.min(window.innerWidth - 280, x + 14) + 'px';
    tooltip.style.top = Math.min(window.innerHeight - 90, y + 14) + 'px';
  }
  function hideTooltip(){ tooltip.hidden = true; }
})();
