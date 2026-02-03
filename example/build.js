const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/app.js',
  sourcemap: true,
  target: ['es2015'],
  platform: 'browser',
  minify: true,
}).catch(() => process.exit(1));
