import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        software: resolve(import.meta.dirname, 'software-a-medida-paraguay/index.html'),
        sistemas: resolve(import.meta.dirname, 'sistemas-de-gestion-paraguay/index.html'),
        web: resolve(import.meta.dirname, 'desarrollo-web-paraguay/index.html'),
        automatizacion: resolve(import.meta.dirname, 'automatizacion-de-procesos/index.html'),
        casoSigfrancis: resolve(import.meta.dirname, 'casos/sigfrancis/index.html'),
        casoLapidas: resolve(import.meta.dirname, 'casos/lapidas-py/index.html'),
        casoNewGalley: resolve(import.meta.dirname, 'casos/new-galley/index.html'),
        casoPadalustro: resolve(import.meta.dirname, 'casos/padalustro-games/index.html'),
      },
    },
  },
})
