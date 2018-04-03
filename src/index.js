const SweetElectron = require('./sweet-electron');

function sweetElectron(electron) {
  return function instanciateSweetElectron() {
    return new SweetElectron(electron);
  };
}

module.exports = sweetElectron;
