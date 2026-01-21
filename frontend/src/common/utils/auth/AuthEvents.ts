export const AUTH_401_EVENT = "auth:401";

export function emitAuth401() {
  window.dispatchEvent(new Event(AUTH_401_EVENT));
}

/* roles
export function emitAuth403(){
  windows.dispatchEvent(new Event (AUTH_403_EVENT));
}

*/
