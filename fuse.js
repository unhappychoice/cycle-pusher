const { FuseBox } = require('fuse-box');

const fuse = FuseBox.init({
  homeDir: 'src',
  package: {
    name: "cycle-pusher",
    main: "index.ts"
  },
  cache: false,
  globals: {"cycle-pusher": "*"},
  output: 'dist/$name.js',
  target: "browser",
  sourceMaps: { project: true, vendor: true },
  plugins: []
});

fuse.bundle('index').instructions('^!index.ts');
fuse.run();
