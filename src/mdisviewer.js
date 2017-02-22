$(document).ready(() => {
  // TODO: Delete this after basic func is implemented
  // for Debugging
  console.log("This is md-index-sideviewer");

  const store = new Storage();

  parallel(Object.keys(STORE), setDefault, loadExtension);

  function setDefault(key, cb) {
    const storeKey = STORE[key];
    store.get(storeKey, (val) => {
      store.set(storeKey, val == null ? DEFAULTS[key] : val, cb);
    });
  }

  function loadExtension() {
  }
});
