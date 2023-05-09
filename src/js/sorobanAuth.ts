import { getNetworkDetails, getPublicKey, isConnected } from "@stellar/freighter-api";
import render from './render'
import { RPC_URL } from './constants'

const FRIENDBOT_URL = 'https://friendbot-futurenet.stellar.org'

/**
 * Fetch account from {@link RPC_URL}.
 * If RPC returns 404 or 405, then the account has not yet been created/funded.
 * In that case, hit {@link FRIENDBOT_URL} to fund it, then re-query RPC to get
 * its up-to-date balance.
 */
async function getAccountBalance(publicKey: string): Promise<number> {
  const account = await fetch(`${RPC_URL}/accounts/${publicKey}`).then(async res => {
    if (res.ok) return res.json()

    if (/40(4|5)/.test(String(res.status))) {
      await fetch(`${FRIENDBOT_URL}?addr=${publicKey}`)
      return await fetch(`${RPC_URL}/accounts/${publicKey}`).then(res => res.json())
    }

    throw new Error(
      `Failed to fetch account from ${RPC_URL}

      Got status ${res.status} ${res.statusText}

      Full response: ${JSON.stringify(res, null, 2)}
      `
    )
  })
  return parseFloat(
    account.balances.find((b: { asset_type: string; }) => b.asset_type === 'native')?.balance
  )
}

// on page load, check if user:
// 1. has Freighter installed
// 2. is logged in to Freighter
// 3. selects Futurenet network
(async () => {
  window.hasFreighter = await isConnected()
  if (window.hasFreighter) {
    try {
      window.sorobanUserAddress = await getPublicKey()
      window.freighterNetwork = await getNetworkDetails()
      window.xlmBalance = await getAccountBalance(window.sorobanUserAddress)
    } catch (e: unknown) {
      console.error(e)
    }
  }
  render()
})();
