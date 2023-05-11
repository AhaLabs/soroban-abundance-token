import { fill, hide, show } from './domHelpers'
import { getBalance, getSymbol } from './soroban/contract'

/**
 * update the html based on user & data state
 */
export default async function render () {
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
    fill('tokenSymbol').with(await getSymbol())
    fill('tokenBalance').with(await getBalance({ id: window.sorobanUserAddress! }))

    hide('gettingStarted')
    show('allReady')
  } else {
    hide('allReady')
    show('gettingStarted')
  }
}
