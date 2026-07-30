import { resolve } from 'node:path';
import { rmSync } from 'node:fs';
import { defineConfig } from 'vite';

export default defineConfig(({command}) => {
  if (command === 'build') {
    // A prior private build must never survive into a later fallback build.
    rmSync(resolve(import.meta.dirname, 'dist/__private_runtime__'), {recursive: true, force: true});
  }
  return {
    build: {
      emptyOutDir: true,
      rollupOptions: {
        input: {
          game: resolve(import.meta.dirname, 'index.html'),
          overlayProof: resolve(import.meta.dirname, 'overlay-proof.html'),
        },
      },
    },
  };
});
