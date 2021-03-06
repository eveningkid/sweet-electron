const electron = require('electron');
const sweet = require('../src')(electron);

sweet()
  .url(is => [__dirname, is.dev() ? 'index_dev.html' : 'index.html'])
  .window({ height: 800 })
  .ready(is => console.log('Mode in', is.dev() ? 'dev' : 'prod'))
  .run();
