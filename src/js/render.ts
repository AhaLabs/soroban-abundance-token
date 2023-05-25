import { fill, hide, show } from './domHelpers'
import { symbol, balance, decimals } from 'abundance-token'
import { formatBalance } from './utils'

let tokenSymbol: string

/**
 * update the html based on user & data state
 */
export default async function render() {
  if (!tokenSymbol) {
    tokenSymbol = (await symbol()).toString()
    fill('tokenSymbol').with(tokenSymbol)
  }

  const allReady = window.hasFreighter &&
    window.sorobanUserAddress &&
    window.freighterNetwork?.network === 'FUTURENET'

  if (allReady) {
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
    if (window.freighterNetwork?.network === 'FUTURENET') {
      document.querySelector('#selectFuturenet')!.className = 'done'
    }

    hide('allReady')
    show('gettingStarted')
  }
}
