chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'loading') return;

  chrome.tabs.executeScript(tabId, {
    code: 'var injected = window.mdisviewerInjected; window.mdisviewerInjected = true; injected;',
    runAt: 'document_start'
  }, (res) => {
    if (chrome.runtime.lastError || // don't continue if error (i.e. page isn't in permission list)
        res[0]) // value of `injected` above: don't inject twice
      return;

    const cssFiles = [
      'mdisviewer.css'
    ];

    const jsFiles = [
      'jquery.js',
      'jquery-ui.js',
      'mdisviewer.js'
    ];

    eachTask([
      (cb) => eachItem(cssFiles, inject('insertCSS'), cb),
      (cb) => eachItem(jsFiles, inject('executeScript'), cb)
    ]);

    function inject(fn) {
      return (file, cb) => {
        chrome.tabs[fn](tabId, { file: file, runAt: 'document_start' }, cb);
      };
    }
  });
});

function eachTask(tasks, done) {
  (function next(index = 0) {
    if (index === tasks.length) done && done();
    else tasks[index](() => next(++index));
  })();
}

function eachItem(arr, iter, done) {
  const tasks = arr.map((item) => {
    return (cb) => iter(item, cb);
  });
  return eachTask(tasks, done);
}
