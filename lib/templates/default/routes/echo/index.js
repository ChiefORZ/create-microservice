const micro = require('micro')
const send = micro.send

const delayed = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(Math.random())
    }, 2000)
  })
}

module.exports = async (req, res) => {
  const random = await delayed()

  send(res, 200, { query: req.query, random: random })
}
