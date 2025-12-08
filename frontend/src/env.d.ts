// esto es para evitar el error:
// Property 'env' does not exist on type 'ImportMeta'.
// que saldría en api.ts

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_BASE_PORT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
