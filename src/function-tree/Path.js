"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Path = function () {
  function Path(path, payload) {
    _classCallCheck(this, Path);

    this.path = path;
    this.payload = payload;
  }

  _createClass(Path, [{
    key: "toJS",
    value: function toJS() {
      return {
        path: this.path,
        payload: this.payload
      };
    }
  }]);

  return Path;
}();

exports.default = Path;
//# sourceMappingURL=Path.js.map