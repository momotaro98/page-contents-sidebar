$(document).ready(() => {
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
    const $toggler = $sidebar.find('.mdisviewer_toggle');
    const $views = $sidebar.find('.mdisviewer_view');
    const adapter =  new GistMD();
    const indexView = new IndexView($dom, store, adapter);
    const optsView = new OptionsView($dom, store);

    $html.addClass(ADDON_CLASS);

    var titleTopArr = [];  // top position list of each title
    var currentTitlePos = -1;  // iniciate the title position for hilighting

    // set window scroll action to chase the titles
    $window.scroll(hilightIndex);
    // set toggle click action to showing sidebar or not
    $toggler.click(toggleSidebarAndSave);

    const views = [indexView, optsView];
    views.forEach((view) => {
      $(view)
        .on(EVENT.VIEW_READY, function (event) {
          showView(this.$view)
        })
        .on(EVENT.VIEW_CLOSE, () => showView(indexView.$view))
        .on(EVENT.OPTS_CHANGE, optionsChange);
    });

    $document.on(EVENT.TOGGLE, layoutChanged);

    $sidebar
      .width(parseInt(store.get(STORE.WIDTH)))
      .resize(layoutChanged)
      .appendTo($('body'));

    adapter.init($sidebar);
    return tryGetIndex();

    // setCurrentTitle sets hilight to the spot title in sidebar
    function setCurrentTitle(i) {
      if (i != currentTitlePos) {
        currentTitlePos = i;
        const $md_list = $views.find('.mdisviewer_md_list');
        const $a = $md_list.find('a');
        $a.removeClass('current_title');
        $a.eq(i).addClass('current_title');
      }
    }

    function optionsChange(event, changes) {
      let reload = false;

      Object.keys(changes).forEach((storeKey) => {
        const value = changes[storeKey];

        switch (storeKey) {
          case STORE.DEEPLEVEL:
            reload = true;
            break;
        }
      });

      if (reload) {
        tryGetIndex();
      }
    }

    function tryGetIndex() {
      const shown = store.get(STORE.SHOWN);
      const deep_level = Number(store.get(STORE.DEEPLEVEL));

      // set titleTopArr for scroll hilight chasing
      const adapter_article = 'article.markdown-body';  // TODO: Replace variable because this is gist feature class name
      const $article_index = $html.find(adapter_article);
      const header_levels = getHeaderLevels(deep_level);
      const $sectionQuery = $article_index.find(header_levels);
      titleTopArr = new Array($sectionQuery.length);
      for (var i = 0; i < $sectionQuery.length; i++) {
        titleTopArr[i] = $sectionQuery.eq(i).offset().top;
      }

      adapter.getPageThatHasMarkdown((page) => {
        if (page) {
          $toggler.show();

          if (shown) {
            toggleSidebar(true);
          }

          if (isSidebarVisible()) {
            indexView.show(page, deep_level);
            showView(indexView.$view);
          }

        }
        else {
          $toggler.hide();
          toggleSidebar(false);
        }
        layoutChanged();
        hilightIndex();
      });
    }

    function showView(view) {
      $views.removeClass('current');
      view.addClass('current');
    }

    function toggleSidebarAndSave() {
      store.set(STORE.SHOWN, !isSidebarVisible(), () => {
        toggleSidebar();
        if (isSidebarVisible()) {
          tryGetIndex();
        }
      });
    }

    function toggleSidebar(visibility) {
      if (visibility !== undefined) {
        if(isSidebarVisible() === visibility) {
          return;
        }
        toggleSidebar();
      }
      else {
       $html.toggleClass(SHOW_CLASS);
       $document.trigger(EVENT.TOGGLE, isSidebarVisible());
      }
    }

    function layoutChanged() {
      const width = $sidebar.outerWidth();
      adapter.updateLayout(isSidebarVisible(), width);
      store.set(STORE.WIDTH, width);
    }

    function isSidebarVisible() {
      return $html.hasClass(SHOW_CLASS);
    }

    // hilightIndex looks for a title to be hilighted and hilight it.
    function hilightIndex() {
      const SCROLL_MARGIN = -5;
      const titleIndexLast = titleTopArr.length - 1;
      var scrollTop = $window.scrollTop();

      // when scrollTop is between the page's top and the first title
      if (scrollTop - titleTopArr[0] <= SCROLL_MARGIN) {
        setCurrentTitle(0);
        return;
      }

      var index = 0;
      var pre_offset = Number.MAX_VALUE;
      $(titleTopArr).each((i, val) => {
        var offset = scrollTop - val;
        if (offset > SCROLL_MARGIN && offset < pre_offset) {
          index = i;
        }
        else if (offset <= SCROLL_MARGIN) {
          return false;
        }
        pre_offset = offset;
      });
      setCurrentTitle(index);
    }

    // TODO: getHeaderLevels should be implemented in adapter class
    function getHeaderLevels(deep_level) {
      var ret_string;
      switch (deep_level) {
        case 1:
          ret_string = 'h1';
          break;
        case 2:
          ret_string = 'h1, h2';
          break;
        case 3:
          ret_string = 'h1, h2, h3';
          break;
        case 4:
          ret_string = 'h1, h2, h3, h4';
          break;
        case 5:
          ret_string = 'h1, h2, h3, h4, h5';
          break;
        case 6:
          ret_string = 'h1, h2, h3, h4, h5, h6';
          break;
        default:
          ret_string = 'h1, h2, h3, h4, h5, h6';
          break;
      }
      return ret_string;
    }
  }
});
