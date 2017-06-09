class OptionsView {
  constructor($dom, store) {
    this.store = store;
    this.$view = $dom.find('.mdisviewer_optsview').submit(this._save.bind(this));
    this.$toggler = $dom.find('.mdisviewer_opts').click(this._toggle.bind(this));
    this.elements = this.$view.find('[data-store]').toArray();
  }

  _toggle(visibility) {
    // argument, visibility is passed
    if (visibility !== undefined) {
      if (this.$view.hasClass('current') === visibility) {
        return;
      }
      return this._toggle();
    }
    // when option view is shown
    if (this.$toggler.hasClass('selected')) {
      this.$toggler.removeClass('selected');
      $(this).trigger(EVENT.VIEW_CLOSE);
    }
    // when other view is shown
    else {
      this._load();
    }
  }

  _load() {
    this._eachOption(
      /*
       * @$elm: Data Element in template.html
       * @key: browser store key
       * @value: browser store value
       * @cb: call back func, which is executed last
       */
      ($elm, key, value, cb) => {
        // load value from browser and set the value to data in template.html
        $elm.val(value);
        cb();
      },
      () => {
        // show opts view
        this.$toggler.addClass('selected');
        $(this).trigger(EVENT.VIEW_READY);
      }
    );
  }

  _save(event) {
    event.preventDefault()

    /*
     * Certainly not a good place to put this logic but Chrome requires
     * permissions to be requested only in response of user input. So...
     */
    // @ifdef CHROME
    const $ta = this.$view.find('[data-store$=EURLS]').filter(':visible')
    if ($ta.length > 0) {
      const storeKey = $ta.data('store')
      const urls = $ta.val().split(/\n/).filter((url) => url !== '')

      if (urls.length > 0) {
        chrome.runtime.sendMessage({type: 'requestPermissions', urls: urls}, (granted) => {
          if (!granted) {
            // permissions not granted (by user or error), reset value
            $ta.val(this.store.get(STORE[storeKey]))
          }
          this._saveOptions()
        })
        return
      }
    }
    // @endif

    return this._saveOptions()
  }

  _saveOptions() {
    const changes = {};
    this._eachOption(
      /*
       * @$elm: Data Element in template.html
       * @key: browser store key
       * @value: browser store value
       * @cb: call back func, which is executed last
       */
      ($elm, key, value, cb) => {
        const newValue = $elm.val();
        // end if no change
        if (value === newValue) {
          return cb();
        }
        changes[key] = [value, newValue];
        // set new value to browser
        this.store.set(key, newValue, cb);
      },
      () => {
        this._toggle(false);  // close opts view temporarily
        if (Object.keys(changes).length) {
          $(this).trigger(EVENT.OPTS_CHANGE, changes);
        }
      }
    );
  }

  _eachOption(processFn, completeFn) {
    parallel(this.elements,  // 1st arg. this.elements are data elements in template.html
      (elm, cb) => {  // 2nd arg. func for iterating each elements in HTML
        const $elm = $(elm);
        const key = STORE[$elm.data('store')];

        this.store.get(key, (value) => {
          processFn($elm, key, value, () => cb());
        });
      },
      completeFn  // 3rd arg. func finally executed
    );
  }
}
