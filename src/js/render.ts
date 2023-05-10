import { fill, hide, show } from './domHelpers'
import { getSymbol } from './contract'

/**
 * update the html based on user & data state
 */
export default async function render () {
  fill('tokenSymbol').with(window.tokenSymbol)

  if (window.hasFreighter) {
    document.querySelector('#getFreighter')!.className = 'done'
  }
  if (window.sorobanUserAddress) {
    document.querySelector('#enableFreighter')!.className = 'done'
  }
  if (window.freighterNetwork?.network === 'Futurenet') {
    document.querySelector('#selectFuturenet')!.className = 'done'
  }

  const readyToGo = window.hasFreighter && window.sorobanUserAddress && window.xlmBalance

  if (readyToGo) {
    const sym = (await getSymbol())?.value()?.toString()
    if (sym) fill('tokenSymbol').with(sym)
    // const tokenBalance = await getBalance({ id: window.sorobanUserAddress })
    // fill('tokenBalance').with(tokenBalance)

    hide('gettingStarted')
    show('allReady')
  } else {
    hide('allReady')
    show('gettingStarted')
  }
}
