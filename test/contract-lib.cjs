const test = require('ava')
const { symbol } = require('abundance-token')

test('symbol', async t => {
  t.is(
    await symbol(),
    'ABND'
  )
})
