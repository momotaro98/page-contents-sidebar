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

  // getPageThatHasMarkdown returns Page object if the page is Markdown file page
  getPageThatHasMarkdown(cb) {
    let is_MarkDown_Page = this._isMarkDownPage();
    if (!is_MarkDown_Page) {
      cb();
    }
    else {
      const page = this._getPage();
       cb(page);
    }
  }

  // _isMarkDownPage returns true(here's page has MarkDown file) or false(Not).
  _isMarkDownPage() {
    // find the file name for see the extension
    let file_name = this._getFileName();
    let extension = file_name.slice(-3); // ex. useful_file.md => .md
    if (extension === ".md") {
      return true;
    }

    return false;
  }

  // _getPage gets the page Object of current page
  _getPage() {
    // get URL without hash part
    const url = location.protocol + "//" + location.host + location.pathname;
    // get title
    const title = document.title;
    // get fileName
    const fileName = this._getFileName();

    return new Page(url, title, fileName);
  }


  // loadMDArray loads array that contains the nested constructure of index
  /*
  * About MD Array
  * Example:
  * ["Chapter1", ["section 1-1", "section 2-2", ["sub-section 2-2-1", "sub-section 2-2-2"]], "Chapter2", "Chapter3"]
  */
  loadMDArray(page, deep_level, cb) {
    // Load the markdown's index array
    var md_array = this._getIndexContentArray();

    // if error occurs
    // cb(err);

    // Filter for deep level option func
    md_array = this._filterByDeepLevel(md_array, deep_level);

    // Pass the md_array to viewer
    cb(null, md_array);
  }

  // _filterByDeepLevel filters the MD array's nested arrays according to deep level
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

  // _getIndexContentArray gets array that contains nested structure of index
  // in use of recursive function, getArray($dom)
  _getIndexContentArray() {
    return getArray($("article").find('h1, h2, h3, h4, h5, h6').find("a:first"));

    function getArray($spec) {
      // getArray uses these 2 flags because the $DOM loop gets each $a DOM.
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

  // _getFileName gets a file name of the MardDown file's Page
  // by doing scraping the HTML file.
  // [Note] If Gist page HTML structure is changed for this,
  // we have to follow the change manually for now.
  /// Current HTML structure
  /// <body>
  /// .
  /// .
  /// <div class="file-info">
  ///   <span class="icon">
  ///    ...
  ///   </span>
  ///   <a class="css-truncate" href="#file-docker_cheat-md">
  ///     <strong class="user-select-contain gist-blob-name css-truncate-target">
  ///       docker_cheat.md
  ///   </strong>
  ///   </a>
  /// </div>
  /// .
  /// .
  /// </body>
  //
  _getFileName() {
    return $("body")
             .find(".file-info")
             .find("a")
             .text()
             .trim();
  }

}
