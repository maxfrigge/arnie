'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = DebuggerProvider;
/* global CustomEvent */
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

function DebuggerProvider() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (typeof window === 'undefined' || typeof window.chrome === 'undefined' && !process && !process.versions && !process.versions.electron) {
    throw new Error('The debugger does not work in this environment, load up the Node debugger instead');
  }

  var isConnected = false;
  var APP_ID = String(Date.now());
  var VERSION = 'v1';
  var backlog = [];

  function _send(debuggingData, context, functionDetails, payload) {
    var type = 'execution';
    var data = {
      name: context.execution.name,
      executionId: context.execution.id,
      functionIndex: functionDetails.functionIndex,
      staticTree: context.execution.staticTree,
      payload: payload,
      datetime: context.execution.datetime,
      data: debuggingData
    };

    if (!isConnected) {
      backlog.push(data);
      return;
    }
    var detail = {
      app: APP_ID,
      version: VERSION,
      type: type,
      data: data
    };

    var event = new CustomEvent('function-tree.client.message', {
      detail: safeStringify(detail)
    });
    window.dispatchEvent(event);
  }

  function sendInitial(type) {
    var event = new CustomEvent('function-tree.client.message', {
      detail: safeStringify({
        app: APP_ID,
        version: VERSION,
        type: type,
        data: {
          functionTrees: backlog
        }
      })
    });
    window.dispatchEvent(event);
  }

  window.addEventListener('function-tree.debugger.pong', function () {
    // When debugger already active, send new init cause new messages
    // might have been prepared while it was waiting for pong
    isConnected = true;
    sendInitial('reinit');
  });
  window.addEventListener('function-tree.debugger.ping', function () {
    // When debugger activates
    isConnected = true;
    sendInitial('init');
  });

  sendInitial('init');

  return function (context, functionDetails, payload) {
    context.debugger = {
      send: function send(data) {
        _send(data, context, functionDetails, payload);
      },
      getColor: function getColor(key) {
        return options.colors[key] || '#333';
      }
    };

    _send(null, context, functionDetails, payload);

    return context;
  };
}
//# sourceMappingURL=Debugger.js.map