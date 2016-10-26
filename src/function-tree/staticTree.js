'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function getFunctionName(fn) {
  var ret = fn.toString();
  ret = ret.substr('function '.length);
  ret = ret.substr(0, ret.indexOf('('));

  return ret;
}

function traverse(functions, item, isChain) {
  if (Array.isArray(item) && typeof isChain === 'boolean') {
    item = item.slice();
    return item.map(function (subItem, index) {
      if (typeof subItem === 'function') {
        var nextSubItem = item[index + 1];
        if (!Array.isArray(nextSubItem) && (typeof nextSubItem === 'undefined' ? 'undefined' : _typeof(nextSubItem)) === 'object') {
          item.splice(index + 1, 1);
          return traverse(functions, subItem, nextSubItem);
        } else {
          return traverse(functions, subItem, null);
        }
      } else if (Array.isArray(item) && isChain) {
        return traverse(functions, subItem, false);
      }
      throw new Error('Signal Tree - Unexpected entry in signal chain');
    }).filter(function (func) {
      return !!func;
    });
  } else if (typeof item === 'function') {
    var _ret = function () {
      var func = item;
      var outputs = isChain;
      var funcDetails = {
        name: func.displayName || getFunctionName(func),
        functionIndex: functions.indexOf(func) === -1 ? functions.push(func) - 1 : functions.indexOf(func),
        function: func
      };
      if (outputs) {
        funcDetails.outputs = {};
        Object.keys(outputs).forEach(function (key) {
          if (func.outputs && !~func.outputs.indexOf(key)) {
            throw new Error('function-tree - Outputs object doesn\'t match list of possible outputs defined for function.');
          }
          funcDetails.outputs[key] = traverse(functions, outputs[key], true);
        });
      }

      return {
        v: funcDetails
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  } else {
    throw new Error('function-tree - Unexpected entry in tree');
  }
}

exports.default = function (tree) {
  var functions = [];

  return traverse(functions, tree, true);
};
//# sourceMappingURL=staticTree.js.map