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

  // getPathWhosePageIsMarkdown returns path string if the page Markdown file page
  getPathWhosePageIsMarkdown(cb) {
    // get path page
    const path = 'https://gist.github.com/username/hashchars';  // dummy page

    let is_MarkDown_Page = this._isMarkDownPage();
    if (!is_MarkDown_Page) {
      cb();
    }
    else {
       cb(path);
    }
  }

  // _isMarkDownPage returns true(here's page is MarkDown file) or false(Not).
  _isMarkDownPage() {
    // find the file name for see the extension
    let file_name = $("body")
                      .find(".gist-header-title")
                      .find("a")
                      .text();  // Now, _isMarkDownPage judges whether the page is MarkDown by finding .gist-header-title class name.
    let extension = file_name.slice(-3);
    if (extension === ".md") {
      return true;
    }

    return false;
  }

  loadMDArray(path, deep_level, cb) {
    // Load the markdown's index array
    var md_array = this._getIndexContentArray();

    // if error occurs
    // cb(err);

    // Filter for deep level option func
    md_array = this._filterByDeepLevel(md_array, deep_level);

    // Pass the md_array to viewer
    cb(null, md_array);
  }

  _filterByDeepLevel(md_array, deep_level) {
    /*
     * Input Example
     * @md_array
     * ["Chapter1", ["section 1-1", "section 2-2"], "Chapter2", "Chapter3"]
     * @deep_level
     * 1
     *
     * Output:
     * ["Chapter1", "Chapter2", "Chapter3"]
     */
    return getArray(md_array, deep_level - 1);

    function getArray(arr, deep_level) {
      var delete_target_array_index_list = [];
      // search the target
      for (var i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
          if (deep_level < 1) {
            delete_target_array_index_list.unshift(i);
          }
          else {
            arr[i] = getArray(arr[i], deep_level - 1);
          }
        }
      }
      // delete the targeted array
      delete_target_array_index_list.forEach((val) => {
        arr.splice(val, 1);
      });
      return arr;
    }
  }

  _getIndexContentArray() {
    return getArray($("article").find('h1, h2, h3, h4, h5, h6').find("a:first"));

    function getArray($spec) {
      var skip_to_currentTag_flag = false;
      var skip_to_NextUpperTag_flag = false;
      var ret_array = [];
      $('article').find('h1, h2, h3, h4, h5, h6').find('a:first-child').each(function() {
        if (skip_to_currentTag_flag || $(this).is($spec)) {
          skip_to_currentTag_flag = true;
          const specTag = $spec.parent()[0].tagName;
          const $parent = $(this).parent();
          const tag = new TagHeaderComparator($parent[0].tagName);

          if (tag.isSameWith(specTag)) {
            if (skip_to_NextUpperTag_flag) {
              skip_to_NextUpperTag_flag = false;
            }

            var indexContent = new IndexContent();
            indexContent.setText($parent.text());
            indexContent.setFragmentID($(this).attr('href'));

            ret_array.push(indexContent);
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

  }

}
