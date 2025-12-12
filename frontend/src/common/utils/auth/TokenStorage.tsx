// esto deberia ser .ts ya que no renderiza html (no tiene return)

//  guarda en memoria (no en localStorage) el access token para adjuntarlo en los requests.
let accessToken: string | null = null

export function setAccessToken(token: string) {
  accessToken = token
}

export function getAccessToken() {
  return accessToken
}

export function clearAccessToken() {
  accessToken = null
}
