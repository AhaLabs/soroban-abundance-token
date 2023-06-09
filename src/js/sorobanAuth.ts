import { getNetworkDetails, getPublicKey, isConnected } from "@stellar/freighter-api";
import render from './render'
import { Server } from 'abundance-token'

type RpcError = { code: number, message: string }

function isRpcError(e: unknown): e is RpcError {
  return typeof e === 'object' && e !== null && 'code' in e && 'message' in e
}

/**
 * Fetch account from {@link RPC_URL}.
 * If RPC returns error code -32600, then the account has not yet been
 * created/funded.  In that case, hit friendbot to fund it, then re-query RPC
 * to get its up-to-date balance.
 */
async function ensureAccountFunded(publicKey: string): Promise<void> {
  try {
    await Server.getAccount(publicKey)
  } catch (e: unknown) {
    if (isRpcError(e) && e.code === -32600) {
      const { friendbotUrl } = await Server.getNetwork()
      await fetch(`${friendbotUrl}?addr=${publicKey}`)
      await Server.getAccount(publicKey)
    } else {
      // re-throw
      throw e
    }
  }
}

// on page load, check if user:
// 1. has Freighter installed
// 2. is logged into Freighter
// 3. has Experimental Mode enabled
// 4. has Futurenet selected
// and make sure their account is funded
(async () => {
  window.hasFreighter = await isConnected()
  if (window.hasFreighter) {
    try {
      window.sorobanUserAddress = await getPublicKey()
      window.freighterNetwork = await getNetworkDetails()
      if (window.sorobanUserAddress) {
        await ensureAccountFunded(window.sorobanUserAddress)
      }
    } catch (e: unknown) {
      console.error(e)
    }
  }
  render()
})();
