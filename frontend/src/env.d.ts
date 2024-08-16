/**
 * Define the environment variables that we use
 */
interface ImportMetaEnv {
  readonly VITE_API_V1_BASE_URL: string;
  readonly VITE_API_V2_BASE_URL: string;
  readonly VITE_DEV_SERVER_PORT: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
