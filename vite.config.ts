import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import nearleyPlugin from './vite-plugin-nearley'

export default defineConfig({
    plugins: [react(), tailwindcss(), basicSsl(), nearleyPlugin()],
})
