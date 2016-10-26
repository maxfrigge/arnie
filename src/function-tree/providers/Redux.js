'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ReduxProvider;
function ReduxProvider(store) {
  return function (context) {
    context.dispatch = function (action) {
      context.debugger && context.debugger.send({
        method: 'redux.dispatch',
        color: '#6333b1',
        args: [action]
      });
      store.dispatch(action);
    };
    context.getState = function () {
      return store.getState();
    };

    return context;
  };
}
//# sourceMappingURL=Redux.js.map