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
