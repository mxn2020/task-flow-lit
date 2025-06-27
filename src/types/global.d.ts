// Global type declarations

// Extend Vite's existing ImportMetaEnv interface
declare module 'vite/client' {
  interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
  }
}

// CSS module declarations for Shoelace themes
declare module '@shoelace-style/shoelace/dist/themes/light.css' {
  const content: string
  export default content
}

declare module '@shoelace-style/shoelace/dist/themes/dark.css' {
  const content: string
  export default content
}

// SVG module declarations
declare module '*.svg' {
  const content: string
  export default content
}

declare module '/vite.svg' {
  const content: string
  export default content
}

export {}
