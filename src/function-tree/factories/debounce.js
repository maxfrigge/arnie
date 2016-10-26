'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = debounceFactory;
function createDebounce(time) {
  var timer = void 0;
  var currentResolver = void 0;

  function debounce(_ref) {
    var path = _ref.path;

    return new Promise(function (resolve) {
      if (timer) {
        currentResolver(path.discarded());
        currentResolver = resolve;
      } else {
        timer = setTimeout(function () {
          currentResolver(path.accepted());
          timer = null;
          currentResolver = null;
        }, time);
        currentResolver = resolve;
      }
    });
  }
  debounce.displayName = 'debounce - ' + time + 'ms';

  return debounce;
}

function debounceFactory(time, continueBranch) {
  return [createDebounce(time), {
    accepted: continueBranch,
    discarded: []
  }];
}
//# sourceMappingURL=debounce.js.map