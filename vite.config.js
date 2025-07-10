import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()],
})

```js
  import { VitePWA } from 'vite-plugin-pwa';
  export default {
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'Potluck App',
          short_name: 'Potluck',
          start_url: '.',
          display: 'standalone',
          background_color: '#ffffff',
          theme_color: '#ffcc00',
          icons: [
            {
              src: '/icons/icon-192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/icons/icon-512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ]
  };
  ```

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import { VitePWA } from 'vite-plugin-pwa';
// import tailwindcss from '@tailwindcss/vite';


// export default defineConfig({
//   plugins: [
//     tailwindcss(),
//     react(),
//    VitePWA({
//   manifest: '/manifest.json',
// })

//   ]
// });
