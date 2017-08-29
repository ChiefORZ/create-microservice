import path from 'path'
import route from 'fs-route'
import { send } from 'micro'

const matcher = route(path.join(__dirname, 'routes'))

export default (req, res) => {
  try {
    const { handler, query, params } = matcher(req)
    if (handler) {
      return handler(req, res, { query, params })
    } else {
      send(res, 404, { error: 'not found' })
    }
  } catch (err) {
    send(res, 500, { error: err.message })
  }
}
