export default (...args) => {
  let headers = args[0]
  if (args.length > 1) {
    headers = {
      [args[0]]: args[1]
    }
  }

  return function method (ctx) {
    for (const header in headers) {
      ctx.set(header, headers[header])
    }
  }
}
