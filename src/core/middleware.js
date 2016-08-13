import pathToRegexp from 'path-to-regexp'

export default function middleware () {
  const keys = []
  const re = pathToRegexp(path, keys)
  const actionTree = createTree(actions)
  return async (ctx, next) => {
    const match = re.exec(ctx.path)

    if (match) {
      const parseUrlParam = (params, value, index) => {
        const key = keys[index].name
        params[key] = value
        return params
      }
      const decodeParam = (param) => {
        if (param !== undefined) {
          return decodeURIComponent(param)
        }

        return param
      }

      const initialInput = match
      .slice(1)
      .map(decodeParam)
      .reduce(parseUrlParam, {})

      await executeTree(actionTree.tree, actionTree.actions, ctx, initialInput)
    }

    next()
  }
}
