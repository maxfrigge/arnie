'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ContextProvider;
function ContextProvider(extendedContext) {
  return function (context, funcDetails, payload) {
    return Object.keys(extendedContext).reduce(function (context, key) {
      if (context.debugger) {
        (function () {
          context[key] = {};

          /*
            Grab the prototype to add methods to proxy.
            We only grab actual added prototypes on first level, not nested and not
            where prototype is base prototypes like Objects and Functions
          */
          var proto = null;

          if (extendedContext[key].constructor && extendedContext[key].constructor.prototype.constructor !== Object.prototype.constructor && extendedContext[key].constructor.prototype.constructor !== Function.prototype.constructor) {
            proto = extendedContext[key].constructor.prototype;
          }

          // The value might be a function that is already wrapped, try grabbing the original
          var contextValue = extendedContext[key];

          /*
            Wraps methods and sends their payload through the debugger
          */
          var proxy = function proxy(sourceKeys, source, target) {
            return sourceKeys.reduce(function (obj, objKey) {
              if (typeof contextValue[objKey] === 'function') {
                obj[objKey] = function () {
                  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                  }

                  context.debugger.send({
                    method: key + '.' + objKey,
                    color: context.debugger.getColor(key),
                    args: args
                  });

                  return contextValue[objKey].apply(contextValue, args);
                };
              } else if (!(objKey in obj)) {
                Object.defineProperty(obj, objKey, {
                  get: function get() {
                    return contextValue[objKey];
                  },
                  set: function set(value) {
                    context.debugger.send({
                      method: key + '.' + objKey + ' =',
                      color: context.debugger.getColor(key),
                      args: [value]
                    });
                    contextValue[objKey] = value;
                  }
                });
              }

              return obj;
            }, target);
          };

          // If the context value is a function, wrap it
          if (typeof contextValue === 'function') {
            context[key] = function () {
              for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
              }

              context.debugger.send({
                method: key,
                color: context.debugger.getColor(key),
                args: args
              });
              return contextValue.apply(null, args);
            };
          }

          // Go through keys original value and wrap any attached methods
          context[key] = proxy(Object.keys(contextValue), contextValue, context[key]); // Object.keys(contextValue).reduce(proxy, context[key])
          // Go through proto
          context[key] = proto ? proxy(Object.getOwnPropertyNames(proto), proto, context[key]) : context[key];
        })();
      } else {
        context[key] = extendedContext[key];
      }

      return context;
    }, context);
  };
}
//# sourceMappingURL=Context.js.map