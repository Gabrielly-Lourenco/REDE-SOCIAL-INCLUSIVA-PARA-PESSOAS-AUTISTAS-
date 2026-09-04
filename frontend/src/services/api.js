const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  let data = null;
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = text ? { message: text } : null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
      data?.error ||
      'O servidor não conseguiu concluir a solicitação.'
    );
  }

  return data;
}

export function cadastrarUsuario(dados) {
  return request('/usuarios', {
    method: 'POST',
    body: JSON.stringify(dados)
  });
}

export function loginUsuario(dados) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify(dados)
  });
}
