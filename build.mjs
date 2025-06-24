import esbuild from 'esbuild';
import { execSync } from 'child_process';

// Step 1: Generate type declarations
execSync('tsc --emitDeclarationOnly --declaration --outDir dist', { stdio: 'inherit' });

// Step 2: Build ESM
await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  format: 'esm',
  outfile: 'dist/index.js',
  external: ['react', 'react-dom']
});

// Step 3: Build CommonJS
await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  format: 'cjs',
  outfile: 'dist/index.cjs',
  external: ['react', 'react-dom']
});

// Step 4: Optionally build IIFE for demo use
await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  format: 'iife',
  globalName: 'reactBackgroundIframe',
  outfile: 'dist/bundle.js',
  external: ['react', 'react-dom']
});
