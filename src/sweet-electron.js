const path = require('path');
const is = require('electron-is');
const App = require('./app');

const DEFAULT_OPTIONS = {
  app: {
    about: null,
    menu: null,
    url: null,
  },
  ipcMain: {
    events: null,
  },
  window: {
  },
  shortcuts: null,
};

class SweetElectron {
  constructor(electron) {
    this.electron = electron;
    this.options = DEFAULT_OPTIONS;

    this.app = new App(this.electron, this.options);
    this.run = this.run.bind(this);
  }

  run(callback) {
    this.app.init();
    if (callback) callback(this.app.mainWindow);
  }

  url(...args) {
    if (args.length === 1 && typeof args[0] === 'function') {
      args = args[0](is);
      if (!Array.isArray(args)) args = [args];
    }

    let url;

    if (args.length > 1) {
      url = path.join(...args);
    } else if (args.length === 1) {
      url = args[0];
    } else {
      throw new Error('Called url(...) without passing any arguments');
    }

    this.options.app.url = url;
    return this;
  }

  menu(menu) {
    this.options.app.menu = menu;
    return this;
  }

  about(about) {
    this.options.app.about = about;
    return this;
  }

  events(events) {
    const ipcMain = this.electron.ipcMain;

    for (const key in events) {
      ipcMain.on(key, (...args) => events[key](...args, this.app.mainWindow));
    }

    this.options.ipcMain.events = events;
    return this;
  }

  window(options) {
    this.options.window = options;
    return this;
  }

  shortcuts(shortcuts) {
    this.options.shortcuts = shortcuts;
    return this;
  }
}

module.exports = SweetElectron;
