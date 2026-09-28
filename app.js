(() => {
  const state = {
    sections: [],
    cells: [],
    relations: [],
    gestures: [],
    selectedId: null,
    filter: 'all',
    status: 'all',
    query: '',
    relationMode: 'all',
    verification: 'all'
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
  const relationFilter = document.getElementById('relation-filter');
  const verificationFilter = document.getElementById('verification-filter');
  const integrityBadge = document.getElementById('integrity-badge');
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

  const verificationLabel = value => ({
    'verified-supported': 'подтверждено',
    'verified-constrained': 'с ограничениями',
    'blocked-as-specified': 'блокер схемы',
    'requires-prototype': 'нужен прототип',
    'non-technical': 'не техническое',
    'unverified': 'не проверено'
  }[value] || value || 'не проверено');

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
    const integrity = validateData();
    renderIntegrity(integrity);
    render();
    renderMatrix();
    openFromHash();
  }).catch(err => {
    mapEl.innerHTML = '<div class="empty-state">Не удалось загрузить данные документации.</div>';
    console.error(err);
  });

  function assertOk(r){ if(!r.ok) throw new Error(r.status + ' ' + r.url); return r; }

  function validateData() {
    const errors = [];
    const warnings = [];
    const sectionIds = new Set();
    state.sections.forEach(s => {
      if (!s.id) errors.push('Раздел без id');
      else if (sectionIds.has(s.id)) errors.push('Дублирующийся раздел: ' + s.id);
      else sectionIds.add(s.id);
    });

    const cellIds = new Set();
    state.cells.forEach(c => {
      if (!c.id) errors.push('Ячейка без id');
      else if (cellIds.has(c.id)) errors.push('Дублирующаяся ячейка: ' + c.id);
      else cellIds.add(c.id);
      if (!sectionIds.has(c.section)) errors.push('Неизвестный section у ' + c.id + ': ' + c.section);
      if (!['approved','concept','needs-validation'].includes(c.status)) errors.push('Неизвестный status у ' + c.id);
    });

    const allowedVerification = new Set(['verified-supported','verified-constrained','blocked-as-specified','requires-prototype','non-technical']);
    state.cells.forEach(c => {
      if (c.verification?.state && !allowedVerification.has(c.verification.state)) {
        errors.push('Неизвестный verification.state у ' + c.id + ': ' + c.verification.state);
      }
    });

    const relationKeys = new Set();
    const degree = new Map(state.cells.map(c => [c.id, 0]));
    const allowedTypes = new Set(['flow','branch','model','constraint','strategy','roadmap','governance']);
    state.relations.forEach((r,i) => {
      if (!cellIds.has(r.from) || !cellIds.has(r.to)) errors.push('Связь #' + (i+1) + ' ссылается на неизвестную ячейку');
      if (!allowedTypes.has(r.type)) errors.push('Связь #' + (i+1) + ' имеет неизвестный type: ' + r.type);
      const key = [r.from,r.to,r.type,r.relation].join('|');
      if (relationKeys.has(key)) errors.push('Дублирующаяся связь: ' + key);
      relationKeys.add(key);
      if (degree.has(r.from)) degree.set(r.from, degree.get(r.from) + 1);
      if (degree.has(r.to)) degree.set(r.to, degree.get(r.to) + 1);
    });
    for (const [id,n] of degree) if (n === 0) warnings.push('Изолированная ячейка: ' + id);
    return {errors,warnings};
  }

  function renderIntegrity(result) {
    const total = state.cells.length + ' ячеек · ' + state.relations.length + ' связей';
    if (result.errors.length) {
      integrityBadge.className = 'integrity-badge error';
      integrityBadge.textContent = 'Ошибка данных: ' + result.errors.length + ' · ' + total;
      integrityBadge.title = result.errors.join('\n');
    } else if (result.warnings.length) {
      integrityBadge.className = 'integrity-badge warn';
      integrityBadge.textContent = 'Данные целы, предупреждений: ' + result.warnings.length + ' · ' + total;
      integrityBadge.title = result.warnings.join('\n');
    } else {
      integrityBadge.className = 'integrity-badge ok';
      integrityBadge.textContent = 'Data integrity: OK · ' + total;
      integrityBadge.title = 'Все section/id/relations согласованы; изолированных ячеек нет.';
    }
  }

  function searchable(cell) {
    return [
      cell.id, cell.title, cell.group, cell.short, cell.description, cell.purpose,
      ...arr(cell.tags), ...arr(cell.platforms), ...arr(cell.models),
      ...arr(cell.inputs), ...arr(cell.outputs), ...arr(cell.constraints), ...arr(cell.open_questions),
      ...Object.entries(cell.parameters || {}).flat(),
      cell.verification?.state || '',
      cell.verification?.summary || '',
      cell.verification?.next_step || ''
    ].join(' ').toLowerCase();
  }

  function visible(cell) {
    const filterOk = state.filter === 'all'
      || (state.filter === 'b2c' || state.filter === 'b2b'
          ? arr(cell.models).includes(state.filter)
          : arr(cell.platforms).includes(state.filter) || arr(cell.platforms).includes('shared'));
    const statusOk = state.status === 'all' || cell.status === state.status;
    const verificationState = cell.verification?.state || 'unverified';
    const verificationOk = state.verification === 'all' || verificationState === state.verification;
    const q = state.query.trim().toLowerCase();
    const queryOk = !q || searchable(cell).includes(q);
    return filterOk && statusOk && verificationOk && queryOk;
  }

  function render() {
    mapEl.innerHTML = '';
    const visibleIds = new Set();
    let count = 0;

    state.sections.forEach(section => {
      const cells = state.cells
        .filter(c => c.section === section.id && visible(c))
        .sort((a,b) => (a.order || 0) - (b.order || 0));
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
          </span>
          <span class="cell-verification verify-${esc(cell.verification?.state || 'unverified')}">${esc(verificationLabel(cell.verification?.state || 'unverified'))}</span>`;
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
    const verification = cell.verification || null;
    const verificationSources = verification?.sources || [];
    const verificationHtml = verification ? `
      <div class="verification-block verify-${esc(verification.state)}">
        <div class="verification-head">
          <span>Техническая проверка</span>
          <b>${esc(verificationLabel(verification.state))}</b>
        </div>
        <div class="verification-summary">${esc(verification.summary || '')}</div>
        ${verification.confidence ? `<div class="verification-meta">Доверие: ${esc(verification.confidence)} · ${esc(verification.date || '')}</div>` : ''}
        ${verification.next_step ? `<div class="verification-next"><strong>Следующий шаг:</strong> ${esc(verification.next_step)}</div>` : ''}
        ${verificationSources.length ? `<div class="verification-sources"><strong>Источники</strong>${verificationSources.map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label || s.url)}</a>`).join('')}</div>` : ''}
      </div>` : `
      <div class="verification-block verify-unverified">
        <div class="verification-head"><span>Техническая проверка</span><b>не проводилась</b></div>
      </div>`;
    detailsBody.innerHTML = `
      <div class="status-pill">${esc(statusLabel(cell.status))}</div>
      ${verificationHtml}
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
          state.filter = 'all'; state.status = 'all'; state.verification = 'all'; state.query = '';
          docSearch.value = ''; statusFilter.value = 'all'; verificationFilter.value = 'all';
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

    state.relations.forEach((rel,index) => {
      if (!visibleIds.has(rel.from) || !visibleIds.has(rel.to)) return;
      const isActive = !!activeId && (rel.from === activeId || rel.to === activeId);
      if (state.relationMode === 'focus' && !isActive) return;
      if (state.relationMode === 'flow' && !['flow','branch'].includes(rel.type)) return;

      const a = document.querySelector(`.map-cell[data-id="${CSS.escape(rel.from)}"]`);
      const b = document.querySelector(`.map-cell[data-id="${CSS.escape(rel.to)}"]`);
      if (!a || !b) return;
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      const acx = ar.left + ar.width/2 - stageRect.left;
      const acy = ar.top + ar.height/2 - stageRect.top;
      const bcx = br.left + br.width/2 - stageRect.left;
      const bcy = br.top + br.height/2 - stageRect.top;
      const dx = bcx - acx, dy = bcy - acy;

      let x1,y1,x2,y2,d,mx,my;
      if (Math.abs(dy) >= Math.abs(dx) * 0.55) {
        const down = dy >= 0;
        x1 = acx; y1 = (down ? ar.bottom : ar.top) - stageRect.top;
        x2 = bcx; y2 = (down ? br.top : br.bottom) - stageRect.top;
        const cy = (y1+y2)/2;
        d = `M ${x1} ${y1} C ${x1} ${cy}, ${x2} ${cy}, ${x2} ${y2}`;
        mx=(x1+x2)/2; my=cy;
      } else {
        const right = dx >= 0;
        x1 = (right ? ar.right : ar.left) - stageRect.left; y1 = acy;
        x2 = (right ? br.left : br.right) - stageRect.left; y2 = bcy;
        const cx = (x1+x2)/2;
        d = `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;
        mx=cx; my=(y1+y2)/2;
      }

      const path = document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('d', d);
      path.classList.add('relation','relation-' + rel.type);
      if (isActive) path.classList.add('active');
      svg.appendChild(path);

      if (isActive && rel.relation) {
        const label = document.createElementNS('http://www.w3.org/2000/svg','text');
        label.setAttribute('x', mx);
        label.setAttribute('y', my - 4);
        label.setAttribute('text-anchor','middle');
        label.classList.add('relation-label');
        label.textContent = rel.relation;
        svg.appendChild(label);
      }
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

  verificationFilter.addEventListener('change', () => {
    state.verification = verificationFilter.value;
    render();
  });

  relationFilter.addEventListener('change', () => {
    state.relationMode = relationFilter.value;
    drawRelations(new Set(state.cells.filter(visible).map(c => c.id)), state.selectedId);
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
