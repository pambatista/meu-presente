/**
 * Utilitários para gerenciar autenticação e tokens
 */

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

/**
 * Obtém o token de acesso atual
 */
export function getAccessToken(): string | null {
  return localStorage.getItem('access_token');
}

/**
 * Obtém o refresh token
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem('refresh_token');
}

/**
 * Renova o token de acesso usando o refresh token
 */
export async function refreshAccessToken(): Promise<string> {
  // Se já está renovando, retorna a promise existente
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        throw new Error('Refresh token não encontrado');
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Erro ao renovar token');
      }

      const data = await response.json();

      // Atualizar tokens no localStorage
      localStorage.setItem('access_token', data.session.access_token);
      localStorage.setItem('refresh_token', data.session.refresh_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      return data.session.access_token;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      
      // Limpar tokens inválidos
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      // Redirecionar para login
      window.location.href = '/login';
      
      throw error;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Faz uma requisição com retry automático em caso de token expirado
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAccessToken();

  if (!token) {
    throw new Error('Token não encontrado');
  }

  // Primeira tentativa
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  // Se o token expirou (401), tenta renovar e fazer a requisição novamente
  if (response.status === 401) {
    try {
      const newToken = await refreshAccessToken();

      // Retry com novo token
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
        },
      });
    } catch (error) {
      console.error('Erro ao renovar token e fazer retry:', error);
      throw error;
    }
  }

  return response;
}
