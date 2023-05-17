import test from 'ava'
import { balance } from 'abundance-token'

test('balance', async t => {
  t.is(
    await balance(),
    'ABND'
  )
})
