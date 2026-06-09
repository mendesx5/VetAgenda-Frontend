const API_URL = 'http://localhost:8080';

export const requestApi = async (method, path, body = null) => {
    const token = localStorage.getItem('vetagenda_token');
    
    const headers = {
        'Content-Type': 'application/json',
    };

    // Se houver um token salvo no sistema, anexa no cabeçalho exigido pelo Spring Security
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${API_URL}${path}`, options);

    // Se o backend disser que o token expirou ou é inválido, desloga o usuário imediatamente
    if (response.status === 401 || response.status === 403) {
        localStorage.clear();
        window.location.href = '/login';
        throw new Error('Sessão expirada. Faça login novamente.');
    }

    if (!response.ok) {
        throw new Error('Erro na requisição à API');
    }

    if (response.status === 204) return null;
    return response.json();
};