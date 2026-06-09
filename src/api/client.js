const BASE = 'http://localhost:8080';

async function request(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(BASE + path, opts);

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
