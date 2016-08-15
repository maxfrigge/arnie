import pathToRegexp from 'path-to-regexp'
import {PATH_WITHOUT_VALUE} from '../core/symbols'

export default function (path, task) {
  const expectedKeys = []
  const re = pathToRegexp(path, expectedKeys)

  const action = (ctx) => {
    const match = re.exec(ctx.path)

    if (match) {
      const parseUrlParam = (params, value, index) => {
        const key = expectedKeys[index].name
        params[key] = value
        return params
      }
      const decodeParam = (param) => {
        if (param !== undefined) {
          return decodeURIComponent(param)
        }

        return param
      }

      const params = match
      .slice(1)
      .map(decodeParam)
      .reduce(parseUrlParam, {})

      const output = Object.assign({
        '_route_did_match': PATH_WITHOUT_VALUE
      }, ctx.query, params)

      if (expectedKeys.length) {
        output.routeKeys = expectedKeys
      }

      return output
    }
  }

  return [
    action, {
      '_route_did_match': task
    }
  ]
}
