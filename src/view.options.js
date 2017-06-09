class OptionsView {
  constructor($dom, store) {
    this.store = store;
    this.$view = $dom.find('.mdisviewer_optsview');
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
        $elm.val(value);
        cb();
      },
      () => {
        this.$toggler.addClass('selected');
        $(this).trigger(EVENT.VIEW_READY);
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
