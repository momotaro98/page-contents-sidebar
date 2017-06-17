class Adapter {
  /**
   * Inits behaviors after the sidebar is added to the DOM.
   * @api public
   */
  init($sidebar) {
    $sidebar
      .resizable({ handles: 'e', minWidth: this.getMinWidth() })
      .addClass(this.getCssClass());
  }

  /**
   * Returns the CSS class to be added to the MDI sidebar.
   * @api protected
   */
  getCssClass() {
    throw new Error('Not implemented');
  }

  /**
   * Returns the minimum width acceptable for the sidebar.
   * @api protected
   */
  getMinWidth() {
    return 200;
  }
}


class TagHeaderComparator {
  constructor(baseTag) {
    this.baseTag = baseTag;
  }

  isUnderThan(tag) {
    return this._getNum(this.baseTag) > this._getNum(tag)
  }

  isUpperThan(tag) {
    return this._getNum(this.baseTag) < this._getNum(tag)
  }

  isSameWith(tag) {
    return this._getNum(this.baseTag) === this._getNum(tag)
  }

  _getNum(tag) {
    return Number(tag.slice(1));
  }
}

class Page {
  constructor(url, title, fileName) {
    this._url = url;
    this._title = title;
    this._fileName = fileName;
  }

  getURL() {
    return this._url;
  }

  getTitle() {
    return this._title;
  }

  getFileName() {
    return this._fileName;
  }
}

class IndexContent {
  constructor() {
    this._text = null;
    this._fragmentID = null;
  }

  getText() {
    return this._text;
  }

  setText(text) {
    this._text = text;
  }

  getFragmentID() {
    return this._fragmentID;
  }

  setFragmentID(fragmentID) {
    this._fragmentID = fragmentID;
  }
}
