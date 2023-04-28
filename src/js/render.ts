import { fill, hide, show } from './domHelpers'

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
    hide('gettingStarted')
    show('allReady')
  } else {
    hide('allReady')
    show('gettingStarted')
  }

  // const tokenBalance = (await window.token.balanceOf(window.sorobanUserAddress)).toNumber()
  // fill('tokenBalance').with(formatLargeNum(tokenBalance))
}
