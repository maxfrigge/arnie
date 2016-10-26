const A = require('../')

module.exports = (config) => {
  const arnie = A(config)
  return (task) => {
    return (event, context, cb) => {
      // TODO: Check serverless callback signature
      // TODO: Transorm input to arnie stanard input
      arnie(task, event)
        // TODO: Transorm reponse from arnie stanard ouput to serverless
        .then((result) => {
          cb(null, result)
        })
        .catch((error) => {
          cb(error, null)
        })
    }
  }
}
