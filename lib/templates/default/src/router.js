import path from 'path'
import qs from 'querystring'

import glob from 'glob'

import { send } from 'micro'

const microRestFs = ((routesDir, config) => {
  let mappedroutes = null
  ;(async (routesDir, config) => {
    const routes = (await Promise.all(glob.sync(routesDir + '/**/{index,get,post,put,patch,delete,options}.js').map(async (file) => {
      const method = path.basename(file, '.js')
      const handler = (await import(file)).default
      const routePath = path.dirname('/' + path.relative(routesDir, file))
      const matcher = RegExp('^' + routePath.replace(/\/_.+?(\/|$)/g, '/([^/]+)$1') + '$')
      const params = (routePath.match(/\/_([^/]+)/g) || []).map(param => param.slice(2))

      return { method, handler, routePath, matcher, params }
    }))).sort((left, right) => {
      if (!left.params.length !== !right.params.length) {
        return left.params.length ? 1 : -1
      } else {
        return left.method !== 'index' ? -1 : 1
      }
    }).sort((config || {}).sort || (() => 0))

    mappedroutes = routes
  })(routesDir, config)

  return req => {
    if (mappedroutes === null) {
      throw Error('server is initializing')
    }

    const [url, querystring] = req.url.split(/\?(.+)/)

    const query = qs.parse(querystring)
    const route = mappedroutes
      .filter(route => (route.method === req.method.toLowerCase() || route.method === 'index') && route.matcher.test(url))
      .concat([{handler: null}])[0]

    const params = url.match(route.matcher).slice(1).reduce((memo, param, index) => {
      memo[route.params[index]] = param
      return memo
    }, {})

    return { query, params, handler: route.handler }
  }
})(path.join(__dirname, 'routes'))

export default (req, res) => {
  try {
    const matched = microRestFs(req)
    if (matched.handler) {
      return matched.handler(req, res, { query: matched.query, params: matched.params })
    } else {
      send(res, 404, { error: 'not found' })
    }
  } catch (err) {
    send(res, 500, { error: err.message })
  }
}
