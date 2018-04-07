# Sweet Electron
Easy, minimalist framework for Electron applications.

```js
const electron = require('electron');
const sweet = require('sweet-electron')(electron);

sweet().url(__dirname, 'index.html').run();
```

Install sweet-electron: `yarn add sweet-electron`.<br />
Copy/paste this code. Run it using `electron`, such as: `$ electron script.js`.

![Sweeeeeet](https://media.giphy.com/media/vjvx6YjG3ADo4/giphy.gif)

- [API](#api)
- [Advanced Example](#advanced-example)
- [Working Example (external)](https://github.com/eveningkid/reacto/blob/master/public/main.js)

# Implementation
## Initialization
sweet-electron requires electron to be passed as an argument when importing it. That makes it more like a wrapper. `sweet()` returns an instance of `SweetElectron`.

## API
SweetElectron
- `url(String|Array[string]|Function)`: wrapper around [loadURL](https://electronjs.org/docs/api/browser-window#winloadurlurl-options)
  - if **String**: will use it as a path directly
  - if **Array[String]**: will call [path.join](https://nodejs.org/api/path.html#path_path_join_paths) on all the arguments
  - if **Function**: should return a *String* or an *Array[String]*. An instance of [electron-is](https://github.com/delvedor/electron-is) is passed as an argument which means that you can write something like: `.url((is) => is.dev() ? 'index_dev.html' : 'index.html')`
- `menu(electron.Menu|Array[Object]|Function)`
  - if **electron.Menu**: will use it directly
  - if **Array[Object]**: wrapper around [electron.Menu.buildFromTemplate](https://electronjs.org/docs/api/menu#menubuildfromtemplatetemplate)
  - if **Function**: will call it with an `electron-is` instance, the [main window](https://electronjs.org/docs/api/browser-window) instance and a reference on [electron.app](https://electronjs.org/docs/api/app). Should return an *Array[Object]* as it will be passed to *electron.Menu.buildFromTemplate*
- `window(Object|Function)`: additional options to be passed during the [main window](https://electronjs.org/docs/api/browser-window) creation
  - if **Function**: should return an *Object*. Will be passed an `electron-is` instance as its first parameter
- `ready(Function)`: function called after Electron's `ready` event is fired. Requires a function, which will get `electron-is` and `mainWindow` parameters.
- `events(Object{channel:callback})`: will loop over each *channel* and register its associated *callback*. Each *callback* will get a reference to the current main window as its last parameter (e.g `(event, payload, mainWindow) => { ... }`). Wrapper around [ipcMain](https://electronjs.org/docs/api/ipc-main). Should be combined using [ipcRenderer](https://electronjs.org/docs/api/ipc-renderer) on client-side
- `shortcuts(Object{command:callback}|Function)`:
  - if **Object**: based on [globalShortcut.register](https://electronjs.org/docs/api/global-shortcut)
  - if **Function**: will get a reference on the main window as its first parameter. Should return an *Object*
- `run()`

# Advanced Example
```js
const electron = require('electron');
const sweet = require('sweet-electron')(electron);

/**
 * All the code has been folded inside `sweet-electron` methods for the sake of
 * the example.
 * For bigger applications, you can surely split your code into different files
 * which will help you to keep an easy-to-maintain project.
 */

sweet()
  .url((is) => [__dirname, is.dev() ? 'index_dev.html' : 'index.html'])
  .window({ height: 800, transparent: true })
  .menu((app) => [{ label: app.getName() }, { type: 'separator' }, { role: 'quit' }])
  .events({
    setOpacity: (event, opacity, mainWindow) => mainWindow.setOpacity(opacity),
  })
  .run();
```
