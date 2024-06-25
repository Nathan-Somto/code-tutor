/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_CODE_API_URL: string
    readonly VITE_MAIN_API_URL: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }