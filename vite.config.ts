import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());

  // Get API_URL_PROD and API_URL_DEV from the loaded environment variables
  const API_URL_PROD = env.VITE_API_URL_PROD;
  const API_URL_DEV = env.VITE_API_URL_DEV;
  const apiUrl = command === 'build' ? API_URL_PROD : API_URL_DEV;

  const siteKey = env.VITE_GOOGLE_RECAPTCHA_SITE_KEY;

  return {
    plugins: [
      react(),
    ],
    optimizeDeps: {
      exclude: [],
    },
   build: {
    minify: 'terser',
    sourcemap: false, // Include source maps for easier debugging in development
    // ...other build options
  },
    define: {
      // Define the API_URL constant with the appropriate value
      __API_URL__: JSON.stringify(apiUrl),
      __APP_KEY__: JSON.stringify("3f3b98d6-a4dd-467a-99d8-5c2ea162741c"),
      __APP_SITE_KEY__: JSON.stringify(siteKey),
    },
  };
});
