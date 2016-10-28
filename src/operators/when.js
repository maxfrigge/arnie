module.exports = (test) => {
  return function when (context) {
    const result = Boolean(test(context).toValue())

    // TODO: Check paths and implement switch
    /*
    when(({input}) => input.path.string), {
      'value1': [],
      'value2': [],
      'otherwise': []
    }
    */

    return result ? context.path.true() : context.path.false()
  }
}
