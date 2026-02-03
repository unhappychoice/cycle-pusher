const esbuild = require('esbuild');

const startDevServer = async () => {
  const ctx = await esbuild.context({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outfile: 'dist/app.js',
    sourcemap: true,
    target: ['es2015'],
    platform: 'browser',
  });

  await ctx.watch();
  console.log('Watching for changes...');

  const { port } = await ctx.serve({
    servedir: '.',
    port: 4444,
    fallback: 'index.html',
  });

  console.log(`Dev server running at http://localhost:${port}`);
};

startDevServer().catch((err) => {
  console.error(err);
  process.exit(1);
});
