const BASE = 'http://localhost:8080';

async function request(method, path, body) {
  // 🌟 1. Recupera o token que guardamos no localStorage durante o login
  const token = localStorage.getItem('vetagenda_token');

  // Inicializa os cabeçalhos padrão
  const headers = { 'Content-Type': 'application/json' };

  // 🌟 2. Se o utilizador estiver logado (com token), anexa o carimbo "Bearer <TOKEN>"
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const opts = {
    method,
    headers, // Passa os cabeçalhos atualizados aqui
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(BASE + path, opts);

  // 🌟 3. Se o Java disser que o token é inválido ou expirou (Erro 401 ou 403)
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem('vetagenda_token');
    localStorage.removeItem('vetagenda_role');
    window.location.href = '/login'; // Joga o utilizador de volta para a tela de login
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(err.message || `Erro ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

// ── Agendamentos ──
export const agendamentosApi = {
  listar: () => request('GET', '/agendamentos'),
  criar: (data) => request('POST', '/agendamentos', data),
  deletar: (id) => request('DELETE', `/agendamentos/${id}`),
  confirmar: (id) => request('PATCH', `/agendamentos/${id}/confirmar`),
  concluir: (id) => request('PATCH', `/agendamentos/${id}/concluir`),
  cancelar: (id) => request('PATCH', `/agendamentos/${id}/cancelar`),
};

// ── Animais ──
export const animaisApi = {
  listar: () => request('GET', '/animais'),
  criar: (data) => request('POST', '/animais', data),
  deletar: (id) => request('DELETE', `/animais/${id}`),
};

// ── Tutores ──
export const tutoresApi = {
  listar: () => request('GET', '/tutores'),
  criar: (data) => request('POST', '/tutores', data),
  deletar: (id) => request('DELETE', `/tutores/${id}`),
};

// ── Veterinários ──
export const veterinariosApi = {
  listar: () => request('GET', '/veterinarios'),
  criar: (data) => request('POST', '/veterinarios', data),
  deletar: (id) => request('DELETE', `/veterinarios/${id}`),
};