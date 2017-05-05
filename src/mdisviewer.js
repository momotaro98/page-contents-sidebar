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
    const $html = $('html');
    const $document = $(document);
    const $dom = $(TEMPLATE);
    const $sidebar = $dom.find('.mdi_sidebar');
    const $views = $sidebar.find('.mdisviewer_view');
    const adapter =  new GistMD();
    const indexview = new IndexView($dom, store, adapter);

    $html.addClass(ADDON_CLASS);

    $sidebar
      .width(parseInt(store.get(STORE.WIDTH)))
      .resize(layoutChanged)
      .appendTo($('body'));

    adapter.init($sidebar);

    $html.addClass(SHOW_CLASS);

    layoutChanged();

    function layoutChanged() {
      const width = $sidebar.outerWidth();
      adapter.updateLayout(isSidebarVisible(), width);
      store.set(STORE.WIDTH, width);
    }

    function isSidebarVisible() {
      return $html.hasClass(SHOW_CLASS);
    }
  }
});
