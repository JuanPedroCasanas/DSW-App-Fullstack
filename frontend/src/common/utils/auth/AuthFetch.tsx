import { clearAccessToken, getAccessToken, setAccessToken } from "./TokenStorage"
import { API_BASE } from '@/lib/api';

// esto (me parece)deberia ser .ts ya que no renderiza html (no tiene return)

// agarra el fetch y lo envuelve con el access token en el
// header Authorization
// Si la respuesta es 401, hace un refresh 
// (pide nuevo access token a /User/refresh) y reintenta la request original.

export async function authFetch(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> {

  const headers = new Headers(init.headers);

  const token = getAccessToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let res = await fetch(input, {
    ...init,
    headers,
    credentials: 'include'
  });

  //Para que lo muestre el toast
  if (res.status !== 401) {
    return res
  }

  const refreshRes = await fetch(`${API_BASE}/User/refresh`, {
    method: 'GET',
    credentials: 'include'
  });

  if (!refreshRes.ok) {
    clearAccessToken(); //Limpio los tokens viejos
    return res; //Para que lo muestre el toast
  }

  console.log(refreshRes);

  const { accessToken } = await refreshRes.json();
  setAccessToken(accessToken);

  //Retry de la request con el access token actualizado
  headers.set('Authorization', `Bearer ${accessToken}`);

  return fetch(input, {
    ...init,
    headers,
    credentials: 'include'
  });
}
