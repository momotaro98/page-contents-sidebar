class IndexView {
  constructor($dom, store, adapter) {
    this.store = store;
    this.adapter = adapter;
    this.$view = $dom.find('.mdisviewer_indexview');
    this.$body = this.$view.find('.mdisviewer_body');
  }

  show(page, deep_level) {
    this.adapter.loadMDArray(page, deep_level, (err, md_array) => {
      if (err) {
        return;
      }
      this._md_array = md_array;
    });
    this._showHeader(page);
    this._showBody();
  }

  _showHeader(page) {
    this.$view.find('.mdisviewer_header')
      .html(
        '<div class="mdisviewer_header_title">' +
          '<a href="' + page.getURL() + '">' + page.getFileName() + '</a>' +
        '</div>'
      );
  }

  _showBody() {
    const generated_html_index = generate_html_index_from_md_array(this._md_array);
    this.$view.find('.mdisviewer_body')
      .html(
        '<div class="mdisviewer_md_list">' +
          generated_html_index
        + '</div>'
      );

    function generate_html_index_from_md_array(arr, header_index = 0) {
      var out = '';
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] instanceof IndexContent) {
          if (out.length > 0) {
            out += '</li><li>';
          }
          out += '<a href="' + arr[i].getFragmentID() + '">' + arr[i].getText() + '</a>';
        } else {
          out += generate_html_index_from_md_array(arr[i], header_index + 1);
        }
      }
      const ol_with_padding = '<ol style="padding: 0px 0px 0px ' + String(header_index * 10) + 'px;">';
      return ol_with_padding + '<li>' + out + '</li></ol>';
    }

  }
}
