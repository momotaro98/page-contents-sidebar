class OptionsView {
  constructor($dom, store) {
    this.store = store;
    this.$view = $dom.find('.mdisviewer_optsview').submit(this._save.bind(this));
    this.elements = this.$view.find('[data-store]').toArray();
  }
}
