const GIST_CONTAINER = '.container';

class GistMD extends Adapter {

  init($sidebar) {
    super.init($sidebar);
  }

  // @override
  getCssClass() {
    return 'mdisviewer_gist_sidebar';
  }

  // updateLayout pushes Gist's content page to right for sidebar
  updateLayout(sidebarVisible, sidebarWidth) {
    const SPACING = 10;
    const $containers = $(GIST_CONTAINER);
    const autoMarginLeft = ($(document).width() - $containers.width()) / 2;
    const shouldPushLeft = sidebarVisible && (autoMarginLeft <= sidebarWidth + SPACING);

    $('html').css('margin-left', shouldPushLeft ? sidebarWidth : '');
    $containers.css('margin-left', shouldPushLeft ? SPACING : '');
  }

  getPathWhosePageIsMarkdown(cb) {
    // get path page
    const path = 'https://gist.github.com/username/hashchars';  // dummy page
    // if the page content is not markdown page
    // or has anything wrong.
    // cb();

    // if ok
    cb(path);
  }

  loadIndexList(path, cb) {
    // Load the markdown's index
    const indexList = ['AAA', 'BBB', 'CCC'];

    // if error occurs
    // cb(err);

    // if ok
    cb(null, indexList);
  }
}
