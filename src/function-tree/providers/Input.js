"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = InputProvider;
function InputProvider() {
  return function (context, funcDetails, payload) {
    context.input = payload || {};

    return context;
  };
}
//# sourceMappingURL=Input.js.map