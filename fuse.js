const { FuseBox } = require('fuse-box');

const fuse = FuseBox.init({
  homeDir: 'src',
  output: 'dist/$name.js',
  plugins: []
});

fuse.bundle('index').instructions('> index.ts');
fuse.run();
