import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
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
            src: '/icons/icon-302.png',
            sizes: '302x263',
            type: 'image/png'
          },
          {
            src: '/icons/icon-574.png',
            sizes: '574x548',
            type: 'image/png'
          }
        ]
      }
    }),
  ],
});


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
