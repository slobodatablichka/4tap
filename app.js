(() => {
  const state = {
    sections: [],
    cells: [],
    relations: [],
    gestures: [],
    selectedId: null,
    filter: 'all',
    status: 'all',
    query: ''
  };

  const mapEl = document.getElementById('system-map');
  const stageEl = document.getElementById('map-stage');
  const svg = document.getElementById('relations-svg');
  const detailsTitle = document.getElementById('details-title');
  const detailsShort = document.getElementById('details-short');
  const detailsBody = document.getElementById('details-body');
  const tooltip = document.getElementById('tooltip');
  const resultCount = document.getElementById('result-count');
  const docSearch = document.getElementById('doc-search');
  const statusFilter = document.getElementById('status-filter');
  const gestureSpace = document.getElementById('gesture-space');
  const matrix = document.getElementById('gesture-matrix');
  const comboSearch = document.getElementById('combo-search');
  const stats = document.getElementById('registry-stats');
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');

  const esc = (s='') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const arr = value => Array.isArray(value) ? value : [];
  const statusLabel = value => ({
    'approved': 'утверждено',
    'concept': 'концепция',
    'needs-validation': 'требует проверки'
  }[value] || value || '—');

  Promise.all([
    fetch('./data/sections.json').then(assertOk).then(r => r.json()),
    fetch('./data/cells.json').then(assertOk).then(r => r.json()),
    fetch('./data/relations.json').then(assertOk).then(r => r.json()),
    fetch('./data/gestures.json').then(assertOk).then(r => r.json())
  ]).then(([sections, cells, relations, gestures]) => {
    state.sections = sections.slice().sort((a,b) => (a.order || 0) - (b.order || 0));
    state.cells = cells;
    state.relations = relations;
    state.gestures = gestures.assignments || [];
    render();
    renderMatrix();
    openFromHash();
  }).catch(err => {
    mapEl.innerHTML = '<div class="empty-state">Не удалось загрузить данные документации.</div>';
    console.error(err);
  });

  function assertOk(r){ if(!r.ok) throw new Error(r.status + ' ' + r.url); return r; }

  function searchable(cell) {
    return [
      cell.id, cell.title, cell.group, cell.short, cell.description, cell.purpose,
      ...arr(cell.tags), ...arr(cell.platforms), ...arr(cell.models),
      ...arr(cell.inputs), ...arr(cell.outputs), ...arr(cell.constraints), ...arr(cell.open_questions),
      ...Object.entries(cell.parameters || {}).flat()
    ].join(' ').toLowerCase();
  }

  function visible(cell) {
    const filterOk = state.filter === 'all'
      || (state.filter === 'b2c' || state.filter === 'b2b'
          ? arr(cell.models).includes(state.filter)
          : arr(cell.platforms).includes(state.filter) || arr(cell.platforms).includes('shared'));
    const statusOk = state.status === 'all' || cell.status === state.status;
    const q = state.query.trim().toLowerCase();
    const queryOk = !q || searchable(cell).includes(q);
    return filterOk && statusOk && queryOk;
  }

  function render() {
    mapEl.innerHTML = '';
    const visibleIds = new Set();
    let count = 0;

    state.sections.forEach(section => {
      const cells = state.cells.filter(c => c.section === section.id && visible(c));
      if (!cells.length) return;

      const lane = document.createElement('section');
      lane.className = 'section-lane';
      lane.dataset.section = section.id;

      const head = document.createElement('div');
      head.className = 'section-head';
      head.innerHTML = `<h3>${esc(section.title)}</h3><div class="section-subtitle">${esc(section.subtitle || '')}</div>`;
      lane.appendChild(head);

      const box = document.createElement('div');
      box.className = 'section-cells';

      cells.forEach(cell => {
        count += 1;
        visibleIds.add(cell.id);
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'map-cell';
        b.dataset.id = cell.id;
        b.dataset.status = cell.status || 'concept';
        b.innerHTML = `
          <span class="cell-kicker">${esc(cell.group || '')}</span>
          <span class="cell-title">${esc(cell.title)}</span>
          <span class="cell-short">${esc(cell.short || '')}</span>
          <span class="cell-meta">
            <span class="cell-status">${esc(statusLabel(cell.status))}</span>
            <span class="cell-models">${esc(arr(cell.models).join(' · '))}</span>
          </span>`;
        b.addEventListener('click', () => selectCell(cell.id, true));
        b.addEventListener('mouseenter', e => showTooltip(e, cell.short));
        b.addEventListener('mousemove', moveTooltip);
        b.addEventListener('mouseleave', hideTooltip);
        b.addEventListener('focus', e => showTooltip(e, cell.short));
        b.addEventListener('blur', hideTooltip);
        box.appendChild(b);
      });

      lane.appendChild(box);
      mapEl.appendChild(lane);
    });

    if (!count) mapEl.innerHTML = '<div class="empty-state">По выбранным условиям ничего не найдено.</div>';
    resultCount.textContent = `Показано положений: ${count} из ${state.cells.length}`;
    requestAnimationFrame(() => drawRelations(visibleIds));
    if (state.selectedId && visibleIds.has(state.selectedId)) applySelectionClasses(state.selectedId);
  }

  function selectCell(id, updateHash=false) {
    const cell = state.cells.find(c => c.id === id);
    if (!cell) return;
    state.selectedId = id;
    applySelectionClasses(id);
    renderDetails(cell);
    drawRelations(new Set(state.cells.filter(visible).map(c => c.id)), id);
    if (updateHash) history.replaceState(null, '', '#cell=' + encodeURIComponent(id));
  }

  function applySelectionClasses(id) {
    const relatedIds = new Set();
    state.relations.forEach(r => {
      if (r.from === id) relatedIds.add(r.to);
      if (r.to === id) relatedIds.add(r.from);
    });
    document.querySelectorAll('.map-cell').forEach(el => {
      el.classList.remove('selected','related','dimmed');
      if (el.dataset.id === id) el.classList.add('selected');
      else if (relatedIds.has(el.dataset.id)) el.classList.add('related');
      else el.classList.add('dimmed');
    });
  }

  function renderDetails(cell) {
    detailsTitle.textContent = cell.title;
    detailsShort.textContent = cell.short || '';

    const incoming = state.relations.filter(r => r.to === cell.id);
    const outgoing = state.relations.filter(r => r.from === cell.id);

    const list = (title, values) => values.length ? `
      <div class="detail-section"><h3>${esc(title)}</h3><ul class="detail-list">
        ${values.map(v => `<li>${esc(v)}</li>`).join('')}
      </ul></div>` : '';

    const relList = (title, rels, dir) => rels.length ? `
      <div class="detail-section"><h3>${esc(title)}</h3><ul class="detail-list">
        ${rels.map(r => {
          const targetId = dir === 'out' ? r.to : r.from;
          const target = state.cells.find(c => c.id === targetId);
          return `<li>${esc(r.relation)} → <button type="button" data-open-cell="${esc(targetId)}">${esc(target ? target.title : targetId)}</button></li>`;
        }).join('')}
      </ul></div>` : '';

    const params = Object.entries(cell.parameters || {});
    detailsBody.innerHTML = `
      <div class="status-pill">${esc(statusLabel(cell.status))}</div>
      <div class="details-purpose"><strong>Назначение.</strong> ${esc(cell.purpose || '—')}</div>
      <div class="details-description">${esc(cell.description || '')}</div>
      ${params.length ? `<div class="detail-section"><h3>Параметры</h3><div class="detail-grid">${params.map(([k,v]) => `<div class="detail-item"><b>${esc(k)}</b>${esc(v)}</div>`).join('')}</div></div>` : ''}
      ${list('Входы', arr(cell.inputs))}
      ${list('Выходы', arr(cell.outputs))}
      ${list('Ограничения', arr(cell.constraints))}
      ${list('Открытые вопросы', arr(cell.open_questions))}
      ${relList('Входящие связи', incoming, 'in')}
      ${relList('Исходящие связи', outgoing, 'out')}
      <div class="detail-tags">
        ${arr(cell.platforms).map(t => `<span class="tag">${esc(t)}</span>`).join('')}
        ${arr(cell.models).map(t => `<span class="tag">${esc(t)}</span>`).join('')}
        ${arr(cell.tags).map(t => `<span class="tag">${esc(t)}</span>`).join('')}
      </div>`;

    detailsBody.querySelectorAll('[data-open-cell]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.openCell;
        const target = document.querySelector(`.map-cell[data-id="${CSS.escape(id)}"]`);
        if (!target) {
          state.filter = 'all'; state.status = 'all'; state.query = '';
          docSearch.value = ''; statusFilter.value = 'all';
          document.querySelectorAll('.filter-btn').forEach(x => x.classList.toggle('active', x.dataset.filter === 'all'));
          render();
        }
        requestAnimationFrame(() => {
          selectCell(id, true);
          document.querySelector(`.map-cell[data-id="${CSS.escape(id)}"]`)?.scrollIntoView({behavior:'smooth',block:'center'});
        });
      });
    });
  }

  function drawRelations(visibleIds, activeId=state.selectedId) {
    while (svg.lastChild && svg.lastChild.tagName !== 'defs') svg.removeChild(svg.lastChild);
    const stageRect = stageEl.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${Math.max(1, stageRect.width)} ${Math.max(1, stageRect.height)}`);
    svg.setAttribute('width', stageRect.width);
    svg.setAttribute('height', stageRect.height);

    state.relations.forEach(rel => {
      if (!visibleIds.has(rel.from) || !visibleIds.has(rel.to)) return;
      const a = document.querySelector(`.map-cell[data-id="${CSS.escape(rel.from)}"]`);
      const b = document.querySelector(`.map-cell[data-id="${CSS.escape(rel.to)}"]`);
      if (!a || !b) return;
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();

      const x1 = ar.left + ar.width/2 - stageRect.left;
      const y1 = ar.top + ar.height - stageRect.top;
      const x2 = br.left + br.width/2 - stageRect.left;
      const y2 = br.top - stageRect.top;
      const mid = (y1 + y2)/2;

      const path = document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('d', `M ${x1} ${y1} C ${x1} ${mid}, ${x2} ${mid}, ${x2} ${y2}`);
      if (activeId && (rel.from === activeId || rel.to === activeId)) path.classList.add('active');
      svg.appendChild(path);
    });
  }

  function openFromHash() {
    const m = location.hash.match(/cell=([^&]+)/);
    if (!m) return;
    const id = decodeURIComponent(m[1]);
    const cell = state.cells.find(c => c.id === id);
    if (!cell) return;
    selectCell(id, false);
    requestAnimationFrame(() => document.querySelector(`.map-cell[data-id="${CSS.escape(id)}"]`)?.scrollIntoView({block:'center'}));
  }

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.filter = btn.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach(x => x.classList.toggle('active', x === btn));
      render();
    });
  });

  statusFilter.addEventListener('change', () => {
    state.status = statusFilter.value;
    render();
  });

  docSearch.addEventListener('input', () => {
    state.query = docSearch.value;
    render();
  });

  window.addEventListener('resize', () => requestAnimationFrame(() => drawRelations(new Set(state.cells.filter(visible).map(c => c.id)))));
  window.addEventListener('hashchange', openFromHash);

  document.getElementById('open-gesture-space').addEventListener('click', () => {
    gestureSpace.hidden = false;
    gestureSpace.scrollIntoView({behavior:'smooth', block:'start'});
  });
  document.getElementById('close-gesture-space').addEventListener('click', () => { gestureSpace.hidden = true; });

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
      detailsBody.innerHTML = '<div class="details-description">Комбинация пока не назначена ни системному, ни пользовательскому действию.</div><div class="detail-grid detail-section"><div class="detail-item"><b>ТИП</b>free</div><div class="detail-item"><b>РЕДАКТИРОВАНИЕ</b>разрешено</div></div>';
    } else {
      detailsShort.textContent = item.title || item.action || combo;
      detailsBody.innerHTML = `<div class="details-description">${esc(item.description || '')}</div>
        <div class="detail-grid detail-section">
          <div class="detail-item"><b>ТИП</b>${esc(item.type)}</div>
          <div class="detail-item"><b>ДЕЙСТВИЕ</b>${esc(item.action || '')}</div>
          <div class="detail-item"><b>РЕДАКТИРОВАНИЕ</b>${item.editable ? 'разрешено' : 'запрещено'}</div>
          <div class="detail-item"><b>СТАТУС</b>${esc(item.status || 'approved')}</div>
        </div>`;
    }
  }

  function updateStats() {
    const sys = state.gestures.filter(x => x.type === 'system').length;
    const usr = state.gestures.filter(x => x.type === 'user').length;
    stats.textContent = `System: ${sys} · User: ${usr} · Free: ${1260 - sys - usr}`;
  }

  comboSearch.addEventListener('input', () => {
    const q = comboSearch.value.trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,2);
    comboSearch.value = q;
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
    const r = e.target?.getBoundingClientRect?.();
    const x = Number.isFinite(e.clientX) && e.clientX > 0 ? e.clientX : (r?.left || 0);
    const y = Number.isFinite(e.clientY) && e.clientY > 0 ? e.clientY : (r?.bottom || 0);
    tooltip.style.left = Math.max(8, Math.min(window.innerWidth - 292, x + 14)) + 'px';
    tooltip.style.top = Math.max(8, Math.min(window.innerHeight - 100, y + 14)) + 'px';
  }
  function hideTooltip(){ tooltip.hidden = true; }
})();
