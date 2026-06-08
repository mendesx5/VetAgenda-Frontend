const API = 'http://localhost:8080';

// ── State ──
let allAgendamentos = [];
let allAnimais = [];
let allTutores = [];
let allVets = [];
let agendamentosFilter = 'todos';
let agendamentosSearch = '';

// ── Date ──
function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', {hour:'2-digit',minute:'2-digit'});
}

function setCurrentDate() {
  const d = new Date();
  document.getElementById('currentDate').textContent = d.toLocaleDateString('pt-BR', {
    weekday: 'short', day: 'numeric', month: 'short'
  });
}

// ── Navigation ──
const viewTitles = {
  dashboard: 'Dashboard',
  agendamentos: 'Agendamentos',
  animais: 'Animais',
  tutores: 'Tutores',
  veterinarios: 'Veterinários'
};

function showView(name, btn) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('view-' + name).classList.add('active');
  document.getElementById('pageTitle').textContent = viewTitles[name];
  if (btn) btn.classList.add('active');
  else {
    document.querySelectorAll('.nav-item').forEach(n => {
      if (n.getAttribute('onclick') && n.getAttribute('onclick').includes("'" + name + "'")) {
        n.classList.add('active');
      }
    });
  }
  closeSidebar();

  if (name === 'dashboard') loadDashboard();
  else if (name === 'agendamentos') loadAgendamentos();
  else if (name === 'animais') loadAnimais();
  else if (name === 'tutores') loadTutores();
  else if (name === 'veterinarios') loadVets();
}

// ── Sidebar ──
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('open');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}

// ── Modals ──
function openModal(id) {
  if (id === 'novoAgendamento') populateAgendamentoSelects();
  if (id === 'novoAnimal') populateAnimalSelects();
  document.getElementById('modal-' + id).classList.add('open');
}
function closeModal(id) {
  document.getElementById('modal-' + id).classList.remove('open');
}

// ── Toast ──
function toast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  const icon = type === 'success'
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
  el.innerHTML = icon + msg;
  document.getElementById('toastContainer').appendChild(el);
  setTimeout(() => {
    el.style.animation = 'toastOut .3s ease forwards';
    setTimeout(() => el.remove(), 300);
  }, 3000);
}

// ── API helper ──
async function api(method, path, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(API + path, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(err.message || 'Erro ' + res.status);
  }
  if (res.status === 204) return null;
  return res.json();
}

// ── Status badge ──
function statusBadge(s) {
  const labels = { AGENDADO: 'Agendado', CONFIRMADO: 'Confirmado', CONCLUIDO: 'Concluído', CANCELADO: 'Cancelado' };
  return `<span class="badge ${(s||'').toLowerCase()}">${labels[s] || s}</span>`;
}

function espBadge(e) {
  const labels = {
    CLINICO_GERAL: 'Clínico Geral', DERMATOLOGIA: 'Dermatologia',
    ORTOPEDIA: 'Ortopedia', CARDIOLOGIA: 'Cardiologia', OFTAMOLOGIA: 'Oftalmologia'
  };
  return e ? `<span class="esp-badge">${labels[e] || e}</span>` : '—';
}

function animalEmoji(especie) {
  const map = { Cachorro:'🐕', Gato:'🐈', Ave:'🦜', Coelho:'🐇', Hamster:'🐹', Réptil:'🦎' };
  return map[especie] || '🐾';
}

function emptyRow(cols, msg) {
  return `<tr><td colspan="${cols}" style="text-align:center;padding:40px;color:var(--stone-400);font-size:14px">${msg}</td></tr>`;
}

// ── DASHBOARD ──
async function loadDashboard() {
  try {
    const [ags, animais, tutores, vets] = await Promise.all([
      api('GET', '/agendamentos').catch(() => []),
      api('GET', '/animais').catch(() => []),
      api('GET', '/tutores').catch(() => []),
      api('GET', '/veterinarios').catch(() => [])
    ]);

    allAgendamentos = ags || [];
    allAnimais = animais || [];
    allTutores = tutores || [];
    allVets = vets || [];

    const total = allAgendamentos.length;
    const agendados = allAgendamentos.filter(a => a.status === 'AGENDADO').length;
    const confirmados = allAgendamentos.filter(a => a.status === 'CONFIRMADO').length;
    const concluidos = allAgendamentos.filter(a => a.status === 'CONCLUIDO').length;
    const cancelados = allAgendamentos.filter(a => a.status === 'CANCELADO').length;

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-agendados').textContent = agendados;
    document.getElementById('stat-confirmados').textContent = confirmados;
    document.getElementById('stat-concluidos').textContent = concluidos;
    document.getElementById('stat-cancelados').textContent = cancelados;
    document.getElementById('dash-animais').textContent = allAnimais.length;
    document.getElementById('dash-tutores').textContent = allTutores.length;
    document.getElementById('dash-vets').textContent = allVets.length;

    const timeline = document.getElementById('dash-timeline');
    const upcoming = allAgendamentos
      .filter(a => a.status !== 'CANCELADO' && a.status !== 'CONCLUIDO')
      .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))
      .slice(0, 6);

    if (upcoming.length === 0) {
      timeline.innerHTML = `<div class="empty-state" style="padding:40px 20px">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <p>Sem agendamentos próximos.<br>Crie um para começar!</p>
      </div>`;
    } else {
      timeline.innerHTML = upcoming.map(a => {
        const d = new Date(a.dataHora);
        const timeStr = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
        
        // ATENÇÃO: Altere o termo após o "a." para o nome exato que veio no seu Response da API
        const animalName = a.nomeAnimal || '—'; 
        const vetName = a.nomeVeterinario || '—';
        const especie = a.animalEspecie || ''; 

        return `<div class="timeline-item">
          <div class="timeline-dot ${(a.status||'').toLowerCase()}"></div>
          <div class="timeline-content">
            <div class="timeline-title">${animalEmoji(especie)} ${animalName} — ${vetName}</div>
            <div class="timeline-meta">${dateStr} às ${timeStr}</div>
          </div>
          ${statusBadge(a.status)}
        </div>`;
      }).join('');
    }
  } catch (e) {
    toast('Erro ao carregar dados. Verifique se a API está rodando.', 'error');
  }
}

// ── AGENDAMENTOS ──
async function loadAgendamentos() {
  try {
    allAgendamentos = await api('GET', '/agendamentos');
    renderAgendamentos();
  } catch (e) {
    document.getElementById('agendamentos-tbody').innerHTML = emptyRow(6, 'Não foi possível carregar. Verifique se a API está rodando em localhost:8080');
  }
}

function renderAgendamentos() {
  const tbody = document.getElementById('agendamentos-tbody');
  let data = allAgendamentos;
  if (agendamentosFilter !== 'todos') data = data.filter(a => a.status === agendamentosFilter);
  if (agendamentosSearch) {
    const q = agendamentosSearch.toLowerCase();
    data = data.filter(a =>
      (a.animal?.name || '').toLowerCase().includes(q) ||
      (a.veterinario?.name || '').toLowerCase().includes(q) ||
      String(a.id).includes(q)
    );
  }
  if (!data.length) {
    tbody.innerHTML = emptyRow(6, 'Nenhum agendamento encontrado.');
    return;
  }
  tbody.innerHTML = data.map(a => `
    <tr>
      <td><span style="color:var(--stone-400);font-size:13px">#${a.id}</span></td>
      <td>
        <div class="animal-chip">
          <div class="animal-avatar">${animalEmoji(a.animal?.especie)}</div>
          ${a.nomeAnimal || '—'}
        </div>
      </td>
      <td>${a.nomeVeterinario || '—'}</td>
      <td style="font-size:13px;color:var(--stone-500)">${formatDate(a.dataHora)}</td>
      <td>${statusBadge(a.status)}</td>
      <td>
        <div class="action-group">
          ${a.status === 'AGENDADO' ? `<button class="btn btn-ghost btn-sm" onclick="mudarStatus(${a.id},'confirmar')" title="Confirmar">✓ Confirmar</button>` : ''}
          ${a.status === 'CONFIRMADO' ? `<button class="btn btn-ghost btn-sm" onclick="mudarStatus(${a.id},'concluir')" title="Concluir">✓ Concluir</button>` : ''}
          ${(a.status === 'AGENDADO' || a.status === 'CONFIRMADO') ? `<button class="btn btn-danger btn-sm" onclick="abrirCancelar(${a.id})">Cancelar</button>` : ''}
          <button class="btn btn-danger btn-sm" onclick="deletarAgendamento(${a.id})" title="Excluir" style="padding:5px 8px">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function filterAgendamentos(f, btn) {
  agendamentosFilter = f;
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderAgendamentos();
}

function searchAgendamentos(q) {
  agendamentosSearch = q;
  renderAgendamentos();
}

async function mudarStatus(id, acao) {
  try {
    await api('PATCH', `/agendamentos/${id}/${acao}`);
    toast('Status atualizado com sucesso!');
    loadAgendamentos();
    loadDashboard();
  } catch (e) { toast('Erro ao atualizar status: ' + e.message, 'error'); }
}

function abrirCancelar(id) {
  document.getElementById('cancelar-id').value = id;
  document.getElementById('cancelar-motivo').value = '';
  openModal('cancelarAgendamento');
}

async function confirmarCancelamento() {
  const id = document.getElementById('cancelar-id').value;
  try {
    await api('PATCH', `/agendamentos/${id}/cancelar`);
    toast('Agendamento cancelado.');
    closeModal('cancelarAgendamento');
    loadAgendamentos();
  } catch (e) { toast('Erro: ' + e.message, 'error'); }
}

async function deletarAgendamento(id) {
  if (!confirm('Deseja excluir este agendamento?')) return;
  try {
    await api('DELETE', `/agendamentos/${id}`);
    toast('Agendamento excluído.');
    loadAgendamentos();
  } catch (e) { toast('Erro: ' + e.message, 'error'); }
}

function populateAgendamentoSelects() {
  const as = document.getElementById('ag-animalId');
  const vs = document.getElementById('ag-veterinarioId');
  as.innerHTML = '<option value="">Selecione um animal...</option>';
  vs.innerHTML = '<option value="">Selecione um veterinário...</option>';
  allAnimais.forEach(a => {
    const o = document.createElement('option');
    o.value = a.id; o.textContent = `${animalEmoji(a.especie)} ${a.name}`;
    as.appendChild(o);
  });
  allVets.forEach(v => {
    const o = document.createElement('option');
    o.value = v.id; o.textContent = `${v.name} — ${v.crmv || ''}`;
    vs.appendChild(o);
  });
}

async function criarAgendamento() {
  const animalId = document.getElementById('ag-animalId').value;
  const veterinarioId = document.getElementById('ag-veterinarioId').value;
  const dataHora = document.getElementById('ag-dataHora').value;
  const status = document.getElementById('ag-status').value;

  if (!animalId || !veterinarioId || !dataHora) {
    toast('Preencha todos os campos obrigatórios.', 'error');
    return;
  }

  try {
    await api('POST', '/agendamentos', {
      animalId: Number(animalId),
      veterinarioId: Number(veterinarioId),
      dataHora: dataHora + ':00',
      status
    });
    toast('Agendamento criado com sucesso!');
    closeModal('novoAgendamento');
    loadAgendamentos();
    loadDashboard();
  } catch (e) { toast('Erro: ' + e.message, 'error'); }
}

// ── ANIMAIS ──
async function loadAnimais() {
  try {
    allAnimais = await api('GET', '/animais');
    const tbody = document.getElementById('animais-tbody');
    if (!allAnimais.length) {
      tbody.innerHTML = emptyRow(7, 'Nenhum animal cadastrado.');
      return;
    }
    tbody.innerHTML = allAnimais.map(a => `
      <tr>
        <td><span style="color:var(--stone-400);font-size:13px">#${a.id}</span></td>
        <td>
          <div class="animal-chip">
            <div class="animal-avatar">${animalEmoji(a.especie)}</div>
            <strong>${a.name}</strong>
          </div>
        </td>
        <td>${a.especie || '—'}</td>
        <td>${a.raca || '—'}</td>
        <td>${a.peso ? a.peso + ' kg' : '—'}</td>
        <td>${a.nomeTutor || '—'}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="deletarAnimal(${a.id})" style="padding:5px 8px">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </td>
      </tr>
    `).join('');
  } catch (e) {
    document.getElementById('animais-tbody').innerHTML = emptyRow(7, 'Não foi possível carregar. Verifique a API.');
  }
}

function populateAnimalSelects() {
  const ts = document.getElementById('animal-tutorId');
  ts.innerHTML = '<option value="">Selecione o tutor...</option>';
  allTutores.forEach(t => {
    const o = document.createElement('option');
    o.value = t.id; o.textContent = t.name;
    ts.appendChild(o);
  });
}

async function criarAnimal() {
  const name = document.getElementById('animal-name').value.trim();
  const tutorId = document.getElementById('animal-tutorId').value;
  if (!name || !tutorId) { toast('Nome e tutor são obrigatórios.', 'error'); return; }

  // Captura o valor original do HTML (AAAA-MM-DD)
  const dataNascimentoRaw = document.getElementById('animal-dataNascimento').value;
  let dataNascimentoFormatada = null;

  // Converte para o padrão BR (DD/MM/AAAA) exigido pelo validador do Java
  if (dataNascimentoRaw) {
    const partes = dataNascimentoRaw.split('-');
    dataNascimentoFormatada = partes[2] + '/' + partes[1] + '/' + partes[0];
  }

  try {
    await api('POST', '/animais', {
      name,
      especie: document.getElementById('animal-especie').value || null,
      raca: document.getElementById('animal-raca').value || null,
      dataNascimento: dataNascimentoFormatada, // Envia a data corrigida em formato texto
      peso: document.getElementById('animal-peso').value ? Number(document.getElementById('animal-peso').value) : null,
      tutorId: Number(tutorId)
    });
    toast('Animal cadastrado!');
    closeModal('novoAnimal');
    allAnimais = await api('GET', '/animais').catch(() => []);
    loadAnimais();
  } catch (e) { toast('Erro: ' + e.message, 'error'); }
}

async function deletarAnimal(id) {
  if (!confirm('Excluir este animal?')) return;
  try {
    await api('DELETE', `/animais/${id}`);
    toast('Animal removido.');
    loadAnimais();
  } catch (e) { toast('Erro: ' + e.message, 'error'); }
}

// ── TUTORES ──
async function loadTutores() {
  try {
    allTutores = await api('GET', '/tutores');
    const tbody = document.getElementById('tutores-tbody');
    if (!allTutores.length) {
      tbody.innerHTML = emptyRow(5, 'Nenhum tutor cadastrado.');
      return;
    }
    tbody.innerHTML = allTutores.map(t => {
      const initials = t.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
      return `
        <tr>
          <td><span style="color:var(--stone-400);font-size:13px">#${t.id}</span></td>
          <td>
            <div style="display:flex;align-items:center;gap:10px">
              <div style="width:32px;height:32px;border-radius:50%;background:var(--green-50);border:1.5px solid var(--green-100);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;color:var(--green-700);flex-shrink:0">${initials}</div>
              <strong>${t.name}</strong>
            </div>
          </td>
          <td style="color:var(--stone-500);font-size:13px">${t.email || '—'}</td>
          <td style="color:var(--stone-500);font-size:13px">${t.telefone || '—'}</td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="deletarTutor(${t.id})" style="padding:5px 8px">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  } catch (e) {
    document.getElementById('tutores-tbody').innerHTML = emptyRow(5, 'Não foi possível carregar.');
  }
}

async function criarTutor() {
  const name = document.getElementById('tutor-name').value.trim();
  const cpf = document.getElementById('tutor-cpf').value.trim(); // Captura o CPF

  // Como o backend exige o CPF, o front também deve barrar se estiver em branco
  if (!name || !cpf) { 
    toast('Nome e CPF são obrigatórios.', 'error'); 
    return; 
  }

  try {
    await api('POST', '/tutores', {
      name,
      cpf, // Envia o CPF para o backend
      email: document.getElementById('tutor-email').value || null,
      telefone: document.getElementById('tutor-telefone').value || null
    });
    toast('Tutor cadastrado!');
    closeModal('novoTutor');
    allTutores = await api('GET', '/tutores').catch(() => []);
    loadTutores();
  } catch (e) { toast('Erro: ' + e.message, 'error'); }
}

async function deletarTutor(id) {
  if (!confirm('Excluir este tutor?')) return;
  try {
    await api('DELETE', `/tutores/${id}`);
    toast('Tutor removido.');
    loadTutores();
  } catch (e) { toast('Erro: ' + e.message, 'error'); }
}

// ── VETERINÁRIOS ──
async function loadVets() {
  try {
    allVets = await api('GET', '/veterinarios');
    const tbody = document.getElementById('vets-tbody');
    if (!allVets.length) {
      tbody.innerHTML = emptyRow(6, 'Nenhum veterinário cadastrado.');
      return;
    }
    tbody.innerHTML = allVets.map(v => {
      const initials = v.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
      return `
        <tr>
          <td><span style="color:var(--stone-400);font-size:13px">#${v.id}</span></td>
          <td>
            <div style="display:flex;align-items:center;gap:10px">
              <div style="width:32px;height:32px;border-radius:50%;background:var(--teal-50);border:1.5px solid var(--teal-100);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;color:var(--teal-600);flex-shrink:0">${initials}</div>
              <strong>${v.name}</strong>
            </div>
          </td>
          <td><code style="font-size:12px;background:var(--stone-100);padding:2px 8px;border-radius:4px">${v.crmv || '—'}</code></td>
          <td>${espBadge(v.especialidade)}</td>
          <td>
            <span style="font-size:13px;color:var(--stone-500)">${(v.agendamentos || []).length} consultas</span>
          </td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="deletarVet(${v.id})" style="padding:5px 8px">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  } catch (e) {
    document.getElementById('vets-tbody').innerHTML = emptyRow(6, 'Não foi possível carregar.');
  }
}

async function criarVeterinario() {
  const name = document.getElementById('vet-name').value.trim();
  const crmv = document.getElementById('vet-crmv').value.trim();
  if (!name || !crmv) { toast('Nome e CRMV são obrigatórios.', 'error'); return; }
  try {
    await api('POST', '/veterinarios', {
      name,
      crmv,
      especialidade: document.getElementById('vet-especialidade').value || null
    });
    toast('Veterinário cadastrado!');
    closeModal('novoVeterinario');
    allVets = await api('GET', '/veterinarios').catch(() => []);
    loadVets();
  } catch (e) { toast('Erro: ' + e.message, 'error'); }
}

async function deletarVet(id) {
  if (!confirm('Excluir este veterinário?')) return;
  try {
    await api('DELETE', `/veterinarios/${id}`);
    toast('Veterinário removido.');
    loadVets();
  } catch (e) { toast('Erro: ' + e.message, 'error'); }
}

// ── Close modal on overlay click ──
document.querySelectorAll('.modal-overlay').forEach(o => {
  o.addEventListener('click', e => {
    if (e.target === o) {
      const id = o.id.replace('modal-', '');
      closeModal(id);
    }
  });
});

// ── Init ──
setCurrentDate();
loadDashboard();