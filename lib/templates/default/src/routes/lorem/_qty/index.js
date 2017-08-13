import lorem from '../lorem'

export default (req, res, opts) => {
  if (opts.params.qty % 2) {
    throw Error('qty param must be even number')
  }

  return `{"lorem": "${lorem(opts.params.qty)}"}`
}
