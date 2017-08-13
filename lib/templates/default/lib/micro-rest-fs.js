import path from 'path'
import querystring from 'querystring'
import fs from 'fs'

function findRoutes (dir) {
  const files = fs.readdirSync(dir)
  const resolve = f => path.join(dir, f)
  const routes = files.filter(f => ['index', 'get', 'post', 'put', 'patch', 'delete', 'options'].indexOf(path.basename(f, '.js')) !== -1).map(resolve)
  const dirs = files.filter(f => fs.statSync(path.join(dir, f)).isDirectory()).map(resolve)
  return routes.concat(...dirs.map(findRoutes))
}

export default (routesDir, config) => {
  let routes = null
  ;(async (routesDir, config) => {
    const scannedRoutes = (await Promise.all(findRoutes(routesDir).map(async (file) => {
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

    routes = scannedRoutes
  })(routesDir, config)

  return req => {
    if (routes === null) {
      throw Error('route initialisation not yet complete')
    }

    const [url, urlQuery] = req.url.split(/\?(.+)/)

    const query = querystring.parse(urlQuery)
    const route = routes
      .filter(route => (route.method === req.method.toLowerCase() || route.method === 'index') && route.matcher.test(url))
      .concat([{ handler: null }])[0]

    const params = url.match(route.matcher).slice(1).reduce((memo, param, index) => {
      memo[route.params[index]] = param
      return memo
    }, {})

    return { query, params, handler: route.handler }
  }
}
