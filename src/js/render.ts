import { fill, hide, show } from './domHelpers'
import { symbol, balance, decimals } from 'abundance-token'
import { formatBalance } from './utils'

let tokenSymbol: string

/**
 * update the html based on user & data state
 */
export default async function render() {
  const allReady = window.hasFreighter &&
    window.sorobanUserAddress &&
    window.freighterNetwork?.network.toUpperCase() === 'FUTURENET'

  if (allReady) {
    // @ts-expect-error
    window.decimals = decimals
    // ensure that the symbol matches the expected (mostly to demo the symbol() function)
    if (!tokenSymbol) {
      tokenSymbol = (await symbol()).toString()
      fill('tokenSymbol').with(tokenSymbol)
    }

    hide('gettingStarted')

    fill('tokenBalance').with(formatBalance(
      await balance({ id: window.sorobanUserAddress! }),
      await decimals()
    ))

    show('allReady')
  } else {
    if (window.hasFreighter) {
      document.querySelector('#getFreighter')!.className = 'done'
    }
    if (window.sorobanUserAddress) {
      document.querySelector('#enableFreighter')!.className = 'done'
    }
    if (window.freighterNetwork?.network.toUpperCase() === 'FUTURENET') {
      document.querySelector('#selectFuturenet')!.className = 'done'
    }

    hide('allReady')
    show('gettingStarted')
  }
}
