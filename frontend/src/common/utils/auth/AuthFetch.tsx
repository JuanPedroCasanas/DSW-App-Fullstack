import { clearAccessToken, getAccessToken, setAccessToken } from "./TokenStorage"

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

  const refreshRes = await fetch('https://localhost:2000/auth/refresh', {
    method: 'POST',
    credentials: 'include'
  });

  if (!refreshRes.ok) {
    clearAccessToken(); //Limpio los tokens viejos
    return res; //Para que lo muestre el toast
  }

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
