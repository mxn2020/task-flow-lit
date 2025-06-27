// Global type declarations for modules that don't have types

declare module '@shoelace-style/shoelace/dist/themes/light.css' {
  const content: string
  export default content
}

declare module '@shoelace-style/shoelace/dist/themes/dark.css' {
  const content: string
  export default content
}

declare module '*.svg' {
  const content: string
  export default content
}

declare module '/vite.svg' {
  const content: string
  export default content
}

// Augment Vite's ImportMetaEnv
declare global {
  interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
  }
}

export {}
