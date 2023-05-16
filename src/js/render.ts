import { fill, hide, show } from './domHelpers'
import { symbol, balance, decimals } from 'abundance-token'
import { formatBalance } from './utils'

/**
 * update the html based on user & data state
 */
export default async function render() {
  if (window.hasFreighter) {
    document.querySelector('#getFreighter')!.className = 'done'
  }
  if (window.sorobanUserAddress) {
    document.querySelector('#enableFreighter')!.className = 'done'
  }
  if (window.freighterNetwork?.network === 'Futurenet') {
    document.querySelector('#selectFuturenet')!.className = 'done'
  }

  const readyToGo = window.hasFreighter && window.sorobanUserAddress

  if (readyToGo) {
    fill('tokenSymbol').with(await symbol())

    fill('tokenBalance').with(formatBalance(
      await balance({ id: window.sorobanUserAddress! }),
      await decimals()
    ))

    hide('gettingStarted')
    show('allReady')
  } else {
    hide('allReady')
    show('gettingStarted')
  }
}
