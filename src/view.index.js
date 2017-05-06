class IndexView {
  constructor($dom, store, adapter) {
    this.store = store;
    this.adapter = adapter;
    this.$view = $dom.find('.mdisviewer_indexview');
    this.$body = this.$view.find('.mdisviewer_body');
  }

  show(path) {
    this.adapter.loadIndexList(path, (err, indexList) => {
      if (err) {
        return;
      }
      // this._prepare_show(indexList);
    });
    this._showHeader(path);
    this._showBody();
  }

  _showHeader(path) {
    this.$view.find('.mdisviewer_header')
      .html(
        '<div class="mdisviewer_header_title">' +
          '<a href="' + path + '">' + 'demo-link' + '</a>' +
        '</div>'
      );

    var $header = this.$view.find('mdisviewer_header');
    console.log("$header:", $header);
  }

  _showBody() {
    this.$view.find('.mdisviewer_body')
      .html(
        '<div class="mdisviwer_content">' +
          '<ul>' +
            '<li>AAA</li>' +
            '<li>BBB</li>' +
            '<li>CCC</li>' +
          '</ul>' +
        '</div>'
      );
  }
}
