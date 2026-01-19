console.log("Vite config loaded successfully");
import { defineConfig } from 'vite'

export default defineConfig({
  root: ".",
  build: {
    outDir: "dist"
  }
})
