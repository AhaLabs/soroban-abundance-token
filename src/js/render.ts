import { fill, hide, show } from './domHelpers'
import { getContract } from './soroban/contract'

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
    let contract = getContract();
    fill('tokenSymbol').with(await contract.symbol())
    //@ts-ignore
    fill('tokenBalance').with(await contract.balance({ id: window.sorobanUserAddress! }))

    hide('gettingStarted')
    show('allReady')
  } else {
    hide('allReady')
    show('gettingStarted')
  }
}
