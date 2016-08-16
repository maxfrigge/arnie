import pathToRegexp from 'path-to-regexp'
import {PATH_WITHOUT_VALUE} from '../core/symbols'
import when from './when'

export default function (...args) {
  let paths
  if (args.length === 1) {
    paths = args[0]
  } else if (args.length === 2) {
    paths = {
      [args[0]]: args[1]
    }
  } else {
    throw new Error('Addon route() expects either one (routes) or two (route, task) arguments.')
  }

  const routes = Object.keys(paths).map((path) => {
    const keys = []
    return {
      path,
      keys,
      regexp: pathToRegexp(path, keys),
      sanitizedKeys: keys.map(sanitizeRouteKey)
    }
  })
  return when((ctx) => getRoute(ctx, routes), paths)
}

function getRoute (ctx, routes) {
  for (const route of routes) {
    const match = route.regexp.exec(ctx.path)
    if (match) {
      const params = getRouteParams(match, route.keys)
      const output = Object.assign({
        [route.path]: PATH_WITHOUT_VALUE
      }, ctx.query, params)

      if (route.sanitizedKeys.length) {
        output.routeKeys = route.sanitizedKeys
      }
      return output
    }
  }

  return {
    otherwise: PATH_WITHOUT_VALUE
  }
}

function getRouteParams (match, keys) {
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
  const params = match
  .slice(1)
  .map(decodeParam)
  .reduce(parseUrlParam, {})

  return params
}

function sanitizeRouteKey (key) {
  return {
    name: key.name,
    optional: key.optional
  }
}
