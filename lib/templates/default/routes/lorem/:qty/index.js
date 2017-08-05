const lorem = require('../lorem')

module.exports = req => `{"lorem": "${lorem(req.params.qty)}"}`
