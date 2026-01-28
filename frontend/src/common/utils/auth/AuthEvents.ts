export const AUTH_401_EVENT = "auth:401";
export const AUTH_403_EVENT = "auth:403";

export function emitAuth401() {
  window.dispatchEvent(new Event(AUTH_401_EVENT));
}
export function emitAuth403(){
  window.dispatchEvent(new Event (AUTH_403_EVENT));
}
