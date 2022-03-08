const { contextBridge, ipcRenderer } = require('electron');

const validChannels = [
  'store-get',
  'store-set',
  'axios-request',
  'open-spec-file',
];

contextBridge.exposeInMainWorld('electron', {
  axios: {
    request(cfg) {
      ipcRenderer.send('http-request', cfg);
    },
  },
  open: {
    specFile() {
      ipcRenderer.send('open-spec-file');
    },
  },
  store: {
    get(val) {
      return ipcRenderer.sendSync('store-get', val);
    },
    set(property, val) {
      ipcRenderer.send('store-set', property, val);
    },
  },
  ipcRenderer: {
    on(channel, func) {
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
});
