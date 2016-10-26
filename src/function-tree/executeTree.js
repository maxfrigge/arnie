'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = executeTree;
/*
  Runs through the tree providing a "next" callback to process next step
  of execution
*/
function executeTree(tree, resolveFunctionResult, initialPayload, end) {
  function runBranch(branch, index, payload, nextBranch) {
    function runNextItem(result) {
      runBranch(branch, index + 1, result, nextBranch);
    }

    function processFunctionOutput(funcDetails, outputResult) {
      return function (result) {
        var newPayload = Object.assign({}, payload, result ? result.payload : {});

        if (result && funcDetails.outputs) {
          var outputs = Object.keys(funcDetails.outputs);

          if (~outputs.indexOf(result.path)) {
            runBranch(funcDetails.outputs[result.path], 0, newPayload, outputResult);
          } else {
            throw new Error('function-tree - function ' + funcDetails.name + ' must use one of its possible outputs: ' + outputs.join(', ') + '.');
          }
        } else {
          outputResult(newPayload);
        }
      };
    }

    var currentItem = branch[index];

    if (!currentItem) {
      nextBranch ? nextBranch(payload) : end(payload);
    } else if (Array.isArray(currentItem)) {
      (function () {
        var itemLength = currentItem.length;
        currentItem.reduce(function (payloads, action) {
          resolveFunctionResult(action, payload, processFunctionOutput(action, function (payload) {
            payloads.push(payload);
            if (payloads.length === itemLength) runNextItem(Object.assign.apply(Object, [{}].concat(payloads)));
          }));
          return payloads;
        }, []);
      })();
    } else {
      resolveFunctionResult(currentItem, payload, processFunctionOutput(currentItem, runNextItem));
    }
  }

  return runBranch(tree, 0, initialPayload, end);
}
//# sourceMappingURL=executeTree.js.map