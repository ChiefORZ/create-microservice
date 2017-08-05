const path = require('path')
const qs = require('querystring')

const glob = require('glob')

const micro = require('micro')
const send = micro.send

const microRestFs = (routesDir, config) => {
  const routes = glob.sync(routesDir + '/**/{index,get,post,put,patch,delete,options}.js').map(file => {
    const method = path.basename(file, '.js')
    const handler = require(file)
    const routePath = path.dirname('/' + path.relative(routesDir, file))
    const matcher = RegExp('^' + routePath.replace(/\/:.+?(\/|$)/g, '/([^/]+)$1') + '$')
    const params = (routePath.match(/\/:([^/]+)/g) || []).map(param => param.slice(2))

    return {method, handler, routePath, matcher, params}
  }).sort((left, right) => {
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

const match = microRestFs(path.join(__dirname, 'routes'))

module.exports = (req, res) => {
  const matched = match(req)

  if (matched) {
    return matched(req, res)
  }

  send(res, 404, { error: 'not found' })
}
