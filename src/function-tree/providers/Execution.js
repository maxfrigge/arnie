'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ExecutionProvider;

var _executeTree = require('../executeTree');

var _executeTree2 = _interopRequireDefault(_executeTree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ExecutionProvider(execution, Abort) {
  return function (context) {
    context.execution = execution;
    context.execution.retry = function (payload) {
      return new Promise(function (resolve) {
        (0, _executeTree2.default)(execution.staticTree, execution.runFunction, payload, resolve);
      });
    };
    context.execution.abort = function () {
      return new Abort();
    };

    return context;
  };
}
//# sourceMappingURL=Execution.js.map