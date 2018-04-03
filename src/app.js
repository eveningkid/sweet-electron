const isURL = require('is-url');
const is = require('electron-is');

class App {
  constructor(electron, options) {
    this.electron = electron;
    this.app = electron.app;
    this.options = options;
    this.mainWindow = null;

    this.init = this.init.bind(this);
    this.createWindow = this.createWindow.bind(this);
    this.setAbout = this.setAbout.bind(this);
    this.registerShortcuts = this.registerShortcuts.bind(this);
  }

  init() {
    this.app
      .on('ready', () => {
        this.setAbout();
        this.createWindow();
        this.registerShortcuts();
      })
      .on('window-all-closed', () => {
        if (process.platform !== 'darwin') this.app.quit();
      })
      .on('activate', () => {
        if (this.mainWindow === null) this.createWindow();
      });
  }

  createWindow() {
    let windowOptions = this.options.window;

    if (typeof windowOptions === 'function') {
      windowOptions = windowOptions(is);
    }

    this.mainWindow = new this.electron.BrowserWindow(windowOptions);

    if (this.options.app.url) {
      let url = this.options.app.url;
      if (!isURL(url)) url = `file:///${url}`;
      this.mainWindow.loadURL(url);
    }

    if (this.options.app.menu) {
      let menu = this.options.app.menu;

      if (!(this.options.app.menu instanceof this.electron.Menu)) {
        if (typeof this.options.app.menu === 'function') {
          menu = menu(this.mainWindow, this.app);
        }

        menu = this.electron.Menu.buildFromTemplate(menu);
      }

      this.electron.Menu.setApplicationMenu(menu);
    }

    this.mainWindow.on('closed', () => (this.mainWindow = null));
    this.mainWindow.once('ready-to-show', () => this.mainWindow.show());
  }

  setAbout() {
    if (this.app.setAboutPanelOptions) {
      const aboutPanelOptions = Object.assign({}, {
        applicationName: this.app.getName(),
        applicationVersion: this.app.getVersion(),
      }, this.options.about);

      this.app.setAboutPanelOptions(aboutPanelOptions);
    }
  }

  registerShortcuts() {
    if (this.options.shortcuts) {
      let shortcuts = this.options.shortcuts;

      if (typeof shortcuts === 'function') {
        shortcuts = shortcuts(this.mainWindow);
      }

      for (const command in shortcuts) {
        this.electron.globalShortcut.register(command, shortcuts[command]);
      }
    }
  }
}

module.exports = App;
