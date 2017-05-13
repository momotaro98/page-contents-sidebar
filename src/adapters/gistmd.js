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

    function getArray($spec) {
      var skip_to_currentTag_flag = false;
      var skip_to_NextUpperTag_flag = false;
      var ret_array = [];
      $('article').find('a').each(function() {
        if (skip_to_currentTag_flag || $(this).is($spec)) {
          skip_to_currentTag_flag = true;
          const specTag = $spec.parent()[0].tagName;
          const $parent = $(this).parent();
          const tag = new TagHeaderComparator($parent[0].tagName);

          if (tag.isSameWith(specTag)) {
            if (skip_to_NextUpperTag_flag) {
              skip_to_NextUpperTag_flag = false;
            }
            ret_array.push($parent.text());
            return true;
          }
          if (tag.isUnderThan(specTag)) {
            if (skip_to_NextUpperTag_flag) {
              return true;
            }
            ret_array.push(getArray($(this)));
            skip_to_NextUpperTag_flag = true;
            return true;
          }
          if (tag.isUpperThan(specTag)) {
            return false;
          }

        }
      });
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
