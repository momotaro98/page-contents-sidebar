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

  loadMDArray(path, cb) {

    function getArray($selector) {
      const specifiedTagName = $selector.parent()[0].tagName;
      var flag_getStarted = false;
      var ret_array = [];
      $('article').find('a').each(function() {
        if (flag_getStarted || $(this).is($selector)) {
          flag_getStarted = true;
          var $parent = $(this).parent();
          if ($parent[0].tagName === specifiedTagName) {  // same headder
            ret_array.push($parent.text());
          } else if (false) {  // TODO: implement switch under or upper header
            ret_array.push(getArray($(this)));
          } else {  // upper header
            return ret_array;
          }
        }
      })
      return ret_array;
    }

    // Load the markdown's index array
    const ret_array = getArray($("article").find("a:first"));
    console.log(ret_array);

    /* link
    const link = $(this).attr('href');
    console.log(link);
    */

    const md_array = [
      'Chapter 1',
      [
        'section 1-1',
        [
          'sub-section 1-1-1',
          'sub-section 1-1-2',
          'sub-section 1-1-3',
        ],
        'section 1-2',
        [
          'sub-section 1-2-1',
        ],
      ],
      'Chapter 2',
      [
        'section 2-1',
        [
          'sub-section 2-1-1',
          'sub-section 2-1-2',
        ]
      ],
      'Chapter 3',
      [
        'section 3-1',
        'section 3-2',
      ]
    ];

    // if error occurs
    // cb(err);

    // if ok
    cb(null, md_array);
  }
}
