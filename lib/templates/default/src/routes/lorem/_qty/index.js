import lorem from '../lorem'

export default req => {
  if (req.params.qty % 2) {
    throw Error('qty param must be even number')
  }

  return `{"lorem": "${lorem(req.params.qty)}"}`
}
