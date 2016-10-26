'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _executeTree = require('./executeTree');

var _executeTree2 = _interopRequireDefault(_executeTree);

var _staticTree = require('./staticTree');

var _staticTree2 = _interopRequireDefault(_staticTree);

var _Execution = require('./providers/Execution');

var _Execution2 = _interopRequireDefault(_Execution);

var _Input = require('./providers/Input');

var _Input2 = _interopRequireDefault(_Input);

var _Path = require('./providers/Path');

var _Path2 = _interopRequireDefault(_Path);

var _Path3 = require('./Path');

var _Path4 = _interopRequireDefault(_Path3);

var _Abort = require('./Abort');

var _Abort2 = _interopRequireDefault(_Abort);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
  Need to create a unique ID for each execution to identify it
  in debugger
*/
function createUniqueId() {
  return Date.now() + '_' + Math.floor(Math.random() * 10000);
}

/*
  Validate any returned value from a function. Has
  to be nothing or an object
*/
function isValidResult(result) {
  return !result || (typeof result === 'undefined' ? 'undefined' : _typeof(result)) === 'object' && !Array.isArray(result);
}

/*
  If it walks like a duck and quacks like a duck...
*/
function isPromise(result) {
  return result && typeof result.then === 'function' && typeof result.catch === 'function';
}

var FunctionTreeExecution = function (_EventEmitter) {
  _inherits(FunctionTreeExecution, _EventEmitter);

  function FunctionTreeExecution(name, staticTree, functionTree, errorCallback) {
    _classCallCheck(this, FunctionTreeExecution);

    var _this = _possibleConstructorReturn(this, (FunctionTreeExecution.__proto__ || Object.getPrototypeOf(FunctionTreeExecution)).call(this));

    _this.id = createUniqueId();
    _this.name = name;
    _this.staticTree = staticTree;
    _this.functionTree = functionTree;
    _this.datetime = Date.now();
    _this.errorCallback = errorCallback;

    _this.runFunction = _this.runFunction.bind(_this);
    return _this;
  }

  /*
    Creates the context for the current function to be run,
    emits events and handles its returned value. Also handles
    the returned value being a promise
  */


  _createClass(FunctionTreeExecution, [{
    key: 'runFunction',
    value: function runFunction(funcDetails, payload, next) {
      var context = this.createContext(funcDetails, payload);
      var functionTree = this.functionTree;
      var errorCallback = this.errorCallback;
      var execution = this;

      functionTree.emit('functionStart', execution, funcDetails, payload);
      var result = funcDetails.function(context);

      if (result instanceof _Abort2.default) {
        return functionTree.emit('abort', execution, funcDetails, payload);
      }

      /*
        If result is a promise we want to emit an event and wait for it to resolve to
        move on
      */
      if (isPromise(result)) {
        functionTree.emit('asyncFunction', execution, funcDetails, payload);
        result.then(function (result) {
          if (result instanceof _Path4.default) {
            functionTree.emit('functionEnd', execution, funcDetails, payload);
            next(result.toJS());
          } else if (funcDetails.outputs) {
            functionTree.emit('functionEnd', execution, funcDetails, payload);
            throw new Error('The result ' + JSON.stringify(result) + ' from function ' + funcDetails.name + ' needs to be a path');
          } else if (isValidResult(result)) {
            functionTree.emit('functionEnd', execution, funcDetails, payload);
            next({
              payload: result
            });
          } else {
            functionTree.emit('functionEnd', execution, funcDetails, payload);
            throw new Error('The result ' + JSON.stringify(result) + ' from function ' + funcDetails.name + ' is not a valid result');
          }
        }).catch(function (result) {
          if (result instanceof Error) {
            errorCallback(result);
          } else if (result instanceof _Path4.default) {
            functionTree.emit('functionEnd', execution, funcDetails, payload);
            next(result.toJS());
          } else if (funcDetails.outputs) {
            var error = new Error('The result ' + JSON.stringify(result) + ' from function ' + funcDetails.name + ' needs to be a path');

            errorCallback(error);
          } else if (isValidResult(result)) {
            functionTree.emit('functionEnd', execution, funcDetails, payload);
            next({
              payload: result
            });
          } else {
            var _error = new Error('The result ' + JSON.stringify(result) + ' from function ' + funcDetails.name + ' is not a valid result');

            errorCallback(_error);
          }
        });
      } else if (result instanceof _Path4.default) {
        functionTree.emit('functionEnd', execution, funcDetails, payload);
        next(result.toJS());
      } else if (funcDetails.outputs) {
        var error = new Error('The result ' + JSON.stringify(result) + ' from function ' + funcDetails.name + ' needs to be a path');

        errorCallback(error);
      } else if (isValidResult(result)) {
        functionTree.emit('functionEnd', execution, funcDetails, payload);
        next({
          payload: result
        });
      } else {
        var _error2 = new Error('The result ' + JSON.stringify(result) + ' from function ' + funcDetails.name + ' is not a valid result');
        errorCallback(_error2);
      }
    }

    /*
      Creates the context for the next running function
    */

  }, {
    key: 'createContext',
    value: function createContext(funcDetails, payload) {
      return [(0, _Execution2.default)(this, _Abort2.default), (0, _Input2.default)(), (0, _Path2.default)()].concat(this.functionTree.contextProviders).reduce(function (currentContext, contextProvider) {
        var newContext = typeof contextProvider === 'function' ? contextProvider(currentContext, funcDetails, payload) : Object.assign(currentContext, contextProvider);

        if (newContext !== currentContext) {
          throw new Error('function-tree: You are not returning the context from a provider');
        }

        return newContext;
      }, {});
    }
  }]);

  return FunctionTreeExecution;
}(_events2.default);

var FunctionTree = function (_EventEmitter2) {
  _inherits(FunctionTree, _EventEmitter2);

  function FunctionTree(contextProviders) {
    var _ret;

    _classCallCheck(this, FunctionTree);

    var _this2 = _possibleConstructorReturn(this, (FunctionTree.__proto__ || Object.getPrototypeOf(FunctionTree)).call(this));

    _this2.cachedTrees = [];
    _this2.cachedStaticTrees = [];
    _this2.contextProviders = contextProviders || [];
    _this2.runTree = _this2.runTree.bind(_this2);
    _this2.runTree.on = _this2.on.bind(_this2);
    _this2.runTree.once = _this2.once.bind(_this2);
    _this2.runTree.off = _this2.removeListener.bind(_this2);

    return _ret = _this2.runTree, _possibleConstructorReturn(_this2, _ret);
  }

  /*
    Analyses the tree to identify paths and its validity. This analysis
    is cached. Then the method creates an execution for the tree to run.
  */


  _createClass(FunctionTree, [{
    key: 'runTree',
    value: function runTree() {
      var _this3 = this;

      var name = void 0;
      var tree = void 0;
      var payload = void 0;
      var cb = void 0;
      var staticTree = void 0;
      var args = [].slice.call(arguments);
      args.forEach(function (arg) {
        if (typeof arg === 'string') {
          name = arg;
        } else if (Array.isArray(arg)) {
          tree = arg;
        } else if (typeof arg === 'function') {
          cb = arg;
        } else {
          payload = arg;
        }
      });

      if (!tree) {
        throw new Error('function-tree - You did not pass in a function tree');
      }

      var treeIdx = this.cachedTrees.indexOf(tree);
      if (treeIdx === -1) {
        staticTree = (0, _staticTree2.default)(tree);
        this.cachedTrees.push(tree);
        this.cachedStaticTrees.push(staticTree);
      } else {
        staticTree = this.cachedStaticTrees[treeIdx];
      }
      var execution = new FunctionTreeExecution(name, staticTree, this, function (error) {
        cb && cb(error, execution, payload);
        setTimeout(function () {
          _this3.emit('error', error, execution, payload);
        });
      });

      this.emit('start', execution, payload);
      (0, _executeTree2.default)(execution.staticTree, execution.runFunction, payload, function (finalPayload) {
        _this3.emit('end', execution, finalPayload);
        cb && cb(null, execution, finalPayload);
      });
    }
  }]);

  return FunctionTree;
}(_events2.default);

exports.default = function (contextProviders) {
  return new FunctionTree(contextProviders);
};
//# sourceMappingURL=index.js.map