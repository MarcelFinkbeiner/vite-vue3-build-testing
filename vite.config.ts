import { rmSync } from 'node:fs';
import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import vue from '@vitejs/plugin-vue';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import pkg from './package.json';
import { fileURLToPath } from 'url';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';

import Components from 'unplugin-vue-components/vite';
import { BootstrapVueNextResolver } from 'unplugin-vue-components/resolvers';

const path = require('path');

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  rmSync('dist-electron', { recursive: true, force: true });

  const isServe = command === 'serve';
  const isBuild = command === 'build';
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG;

  return {
    build: {
      target: 'es2022',
      chunkSizeWarningLimit: 10240,
    },
    base: './',
    plugins: [
      vue(),
      Components({
        resolvers: [BootstrapVueNextResolver()],
      }),
      VueI18nPlugin({
        escapeHtml: false,
        strictMessage: false,
        /* options */
        // locale messages resource pre-compile option
        include: resolve(dirname(fileURLToPath(import.meta.url)), './src/i18n/locales/**'),
      }),
      electron([
        {
          // Main-Process entry file of the Electron App.
          entry: 'electron/main/index.ts',
          onstart(options) {
            if (process.env.VSCODE_DEBUG) {
              console.log(/* For `.vscode/.debug.script.mjs` */ '[startup] Electron App');
            } else {
              options.startup();
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: 'dist-electron/main',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
            },
          },
        },
        {
          entry: 'electron/preload/index.ts',
          onstart(options) {
            // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
            // instead of restarting the entire Electron App.
            options.reload();
          },
          vite: {
            build: {
              sourcemap: sourcemap ? 'inline' : undefined, // #332
              minify: isBuild,
              outDir: 'dist-electron/preload',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
            },
          },
        },
      ]),
      // Use Node.js API in the Renderer-process
      renderer(),
    ],
    resolve: {
      preserveSymlinks: true,
      alias: {
        'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js',
        '@': path.resolve(__dirname, './src'),
      },
      extensions: ['.js', '.ts', '.vue', '.json', '.mjs', '.tsx', '.scss'],
    },
    server: {
      host: 'localhost',
      port: 9080,
    },
    //   process.env.VSCODE_DEBUG &&
    //   (() => {
    //     const url = new URL('http://localhost:9080'); //pkg.debug.env.VITE_DEV_SERVER_URL);
    //     console.log('mein url', url);
    //     return {
    //       host: url.hostname,
    //       port: +url.port,
    //     };
    //   })(),
    clearScreen: false,
  };
});
