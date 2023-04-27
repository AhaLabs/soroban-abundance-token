import { fill, hide, show } from './domHelpers'

const formatLargeNum = (n: number) => n >= 1e5 || (n < 1e-3 && n !== 0)
  ? n.toExponential(2)
  : new Intl.NumberFormat(undefined, { maximumSignificantDigits: 3 }).format(n)

// update the html based on user & data state
export default async function render () {
  fill('tokenSymbol').with(window.tokenSymbol)

  if (window.hasFreighter) {
    document.querySelector('#getFreighter')!.className = 'done'
  }

  // if not signed in, stop here
  if (!window.sorobanUserAddress) return

  hide('signed-out')
  show('signed-in')

  // const ethBalance = await window.ethProvider.getBalance(window.ethUserAddress)
  const xlmBalance = 0

  // if 0 XLM, cannot pay transaction fee to mint token
  if (xlmBalance.eq(0)) {
    show('xlm-balance-zero')
    hide('xlm-balance-positive')
    return
  }

  const tokenBalance = (await window.token.balanceOf(window.sorobanUserAddress)).toNumber()
  fill('tokenBalance').with(formatLargeNum(tokenBalance))

  hide('xlm-balance-zero')
  show('xlm-balance-positive')
}
