const A = require('../')

module.exports = (config) => {
  const arnie = A(config)
  return (task) => {
    return (ctx) => {
      // TODO: Prevent parallel execution or use clones of ctx
      // .. otherwise this leads to race conditions on ctx writes
      // .. an alternative would be to make ctx immutable
      // .. should we really pass the ctx? or just request param?
      // IDEA: Use a standarised input with request & reponse data
      return arnie(task, ctx)
    }
  }
}
