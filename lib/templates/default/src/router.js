import path from 'path'
import qs from 'querystring'

import glob from 'glob'

import { send } from 'micro'

const microRestFs = async (routesDir, config) => {
  const routes = await Promise.all(glob.sync(routesDir + '/**/{index,get,post,put,patch,delete,options}.js').map(async (file) => {
    const method = path.basename(file, '.js')
    const imported = await import(file)
    const handler = imported.default
    const routePath = path.dirname('/' + path.relative(routesDir, file))
    const matcher = RegExp('^' + routePath.replace(/\/_.+?(\/|$)/g, '/([^/]+)$1') + '$')
    const params = (routePath.match(/\/_([^/]+)/g) || []).map(param => param.slice(2))

    return { method, handler, routePath, matcher, params }
  }))

  routes.sort((left, right) => {
    if (!left.params.length !== !right.params.length) {
      return left.params.length ? 1 : -1
    } else {
      return left.method !== 'index' ? -1 : 1
    }
  }).sort((config || {}).sort || (() => 0))

  return req => {
    const [url, querystring] = req.url.split(/\?(.+)/)

    req.query = qs.parse(querystring)
    const route = routes
      .filter(route => (route.method === req.method.toLowerCase() || route.method === 'index') && route.matcher.test(url))
      .concat([{handler: null}])[0]

    req.params = url.match(route.matcher).slice(1).reduce((memo, param, index) => {
      memo[route.params[index]] = param
      return memo
    }, {})

    return route.handler
  }
}

// TODO: ensure match is set before used, don't rely on request resolving after
let match
microRestFs(path.join(__dirname, 'routes')).then(rested => (match = rested))

// TODO: can this module exports be changed to es6 module pattern?
module.exports = async (req, res) => {
  const matched = await match(req)

  if (matched) {
    try {
      return matched(req, res)
    } catch (err) {
      send(res, 500, { error: err.message })
    }
  } else {
    send(res, 404, { error: 'not found' })
  }

}
