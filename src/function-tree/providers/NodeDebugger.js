'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = NodeDebuggerProvider;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function safeStringify(obj) {
  var cache = [];
  var returnValue = JSON.stringify(obj || {}, function (key, value) {
    if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null) {
      if (cache.indexOf(value) === -1) {
        cache.push(value);

        return value;
      }
      return '[CIRCULAR]';
    }
    return value;
  });

  cache = null;

  return returnValue;
}

function NodeDebuggerProvider() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (typeof window !== 'undefined' && (typeof window.chrome !== 'undefined' || process && process.versions && process.versions.electron)) {
    throw new Error('function-tree: You are running the Node debugger, but the Chrome debugger is supported');
  }

  function padded(text) {
    var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var padding = new Array(size + 1).join(' ');

    return padding + text + padding;
  }

  var registeredFunctionTrees = {};

  function _send(debuggingData, context, functionDetails, payload) {
    var id = context.execution.id + '_' + context.execution.executionId;
    var prevFunction = registeredFunctionTrees[id] && registeredFunctionTrees[id].functions[functionDetails.functionIndex] ? registeredFunctionTrees[id].functions[functionDetails.functionIndex] : null;
    var isExistingFunction = Boolean(prevFunction && prevFunction.functionIndex === functionDetails.functionIndex);

    if (registeredFunctionTrees[id] && registeredFunctionTrees[id].functions[functionDetails.functionIndex]) {
      registeredFunctionTrees[id].functions[functionDetails.functionIndex].data.push(debuggingData);
    } else if (isExistingFunction) {
      prevFunction.data = prevFunction.data.concat(debuggingData);
    } else if (registeredFunctionTrees[id]) {
      registeredFunctionTrees[id].functions[functionDetails.functionIndex] = {
        functionIndex: functionDetails.functionIndex,
        outputs: functionDetails.outputs,
        payload: payload,
        data: []
      };
    } else {
      registeredFunctionTrees[id] = {
        logLevel: 0,
        staticTree: context.execution.staticTree,
        functions: {}
      };
      registeredFunctionTrees[id].functions[functionDetails.functionIndex] = {
        functionIndex: functionDetails.functionIndex,
        outputs: functionDetails.outputs,
        payload: payload,
        data: []
      };
    }

    if (isExistingFunction) {
      var data = prevFunction.data[prevFunction.data.length - 1];
      var args = data ? data.args || [] : [];

      console.log.apply(console, [padded(_chalk2.default[data.color || 'white'](data.method), registeredFunctionTrees[id].logLevel)].concat(args.filter(function (arg) {
        return typeof arg !== 'function';
      }).map(function (arg) {
        return padded(_chalk2.default.white(JSON.stringify(arg)), registeredFunctionTrees[id].logLevel);
      })));
    } else {
      if (registeredFunctionTrees[id].functions.length === 1) {
        console.log(_chalk2.default.bgWhite.black.bold(padded(context.execution.name || context.execution.id)));
      }

      if (prevFunction && prevFunction.outputs) {
        var chosenOutput = Object.keys(prevFunction.outputs).filter(function (outputKey) {
          if (prevFunction.outputs[outputKey].length && ( // Might be an array which is the first element
          Array.isArray(prevFunction.outputs[outputKey][0]) && prevFunction.outputs[outputKey][0][0].functionIndex === functionDetails.functionIndex || prevFunction.outputs[outputKey][0].functionIndex === functionDetails.functionIndex)) {
            return true;
          }

          return false;
        })[0];
        console.log(padded(_chalk2.default.dim.underline.white(chosenOutput), registeredFunctionTrees[id].logLevel));
        registeredFunctionTrees[id].logLevel++;
      }

      var payloadString = safeStringify(payload);

      console.log(padded(_chalk2.default.underline.white(functionDetails.name), registeredFunctionTrees[id].logLevel));
      console.log(padded(_chalk2.default.dim(payloadString.length > 300 ? payloadString.substr(0, 297) + '...' : payloadString), registeredFunctionTrees[id].logLevel));
    }
  }

  return function (context, functionDetails, payload) {
    context.debugger = {
      send: function send(data) {
        _send(data, context, functionDetails, payload);
      },
      getColor: function getColor(key) {
        return options.colors[key] || 'white';
      }
    };

    _send(null, context, functionDetails, payload);

    return context;
  };
}
//# sourceMappingURL=NodeDebugger.js.map