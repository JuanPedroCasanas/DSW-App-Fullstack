import { emitAuth401, emitAuth403 } from "./AuthEvents";
import { getAccessToken } from "./TokenStorage"

// agarra el fetch y lo envuelve con el access token en el
// header Authorization

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
    headers
  });

  
  //Emite una señal si nos llega un 401 (Token expirado) para redirigir al usuario al login nuevamente.
  if (res.status === 401) {
    emitAuth401();
  }

  if (res.status === 403) {
    emitAuth403();
  }

  //Para que lo muestre el toast
  return res;

}
