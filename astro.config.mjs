import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://ahalabs.dev',
  base: '/soroban-abundance-token',
  vite: {
    sourcemap: true,
  },
})
