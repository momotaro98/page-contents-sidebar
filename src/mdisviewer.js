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
    const $window = $(window);
    const $html = $('html');
    const $document = $(document);
    const $dom = $(TEMPLATE);
    const $sidebar = $dom.find('.mdi_sidebar');
    const $views = $sidebar.find('.mdisviewer_view');
    const adapter =  new GistMD();
    const indexView = new IndexView($dom, store, adapter);

    $html.addClass(ADDON_CLASS);

    // set each index title top position
    var titleTopArr = [];
    const adapter_article = 'article.markdown-body';  // TODO: Replace variable because this is gist feature const
    const $article_index = $html.find(adapter_article);
    const $sectionQuery = $article_index.find('h1, h2, h3, h4, h5');  // TODO: Replace because this is not flexible
    for (var i = 0; i < $sectionQuery.length; i++) {
      titleTopArr[i] = $sectionQuery.eq(i).offset().top;
    }

    // set hilight to the 1st title
    var currentTitlePos = -1;
    setCurrentTitle(0);

    // set window scroll action to chase the titles
    $window.scroll(() => {
      const SCROLL_MARGIN = 50;
      const titleIndexLast = titleTopArr.length - 1;
      var winHeight = $window.height();  // width of the window
      var scrollHeight = $document.height();
      var scrollRange = scrollHeight - scrollHeight;
      var scrollTop = $window.scrollTop();

      if (scrollTop <= SCROLL_MARGIN) {
        setCurrentTitle(0);
      }
      else {
        var index = 0;
        var pre_diff = Number.MAX_VALUE;
        $(titleTopArr).each((i, val) => {
          var diff = Math.abs(scrollTop - val);
          if (diff > pre_diff) {
            index = i - 1;
            return false;
          }
          pre_diff = diff;
        });
        setCurrentTitle(index);
      }
    });

    $sidebar
      .width(parseInt(store.get(STORE.WIDTH)))
      .resize(layoutChanged)
      .appendTo($('body'));

    adapter.init($sidebar);
    return tryGetIndex();

    function setCurrentTitle(i) {
      if (i != currentTitlePos) {
        currentTitlePos = i;
        const $md_list = $views.find('.mdisviewer_md_list');
        const $a = $md_list.find('a');
        $a.removeClass('current_title');
        $a.eq(i).addClass('current_title');
      }
    }

    function tryGetIndex() {
      adapter.getPathWhosePageIsMarkdown((path) => {
        if (path) {
          $html.addClass(SHOW_CLASS);

          if (isSidebarVisible()) {
            // TODO: check the changed to use browser's cache

            indexView.show(path);
          }

        }
        else {
          // hide the sidebar
        }
        layoutChanged();
      });
    }

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
