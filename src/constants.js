const ADDON_CLASS = 'md-index-sideviewer';
const SHOW_CLASS = 'mdisviewer-show';

const STORE = {
  WIDTH : 'mdisviewer.sidebar_width',
  DEEPLEVEL : 'mdisviewer.deep_level',
  SHOWN : 'mdisviewer.sidebar_shown'
};

const DEFAULTS = {
  WIDTH : 232,
  DEEPLEVEL: 6,
  SHOWN : true
};

const EVENT = {
  TOGGLE        : 'octotree:toggle',
  VIEW_READY    : 'mdisviewer:ready',
  VIEW_CLOSE    : 'mdisviewer:close',
  OPTS_CHANGE   : 'mdisviewer:change',
}
