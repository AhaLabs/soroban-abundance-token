import { getNetworkDetails, getPublicKey, isConnected } from "@stellar/freighter-api";
import render from './render'
import { server } from 'abundance-token'

type RpcError = { code: number, message: string }

function isRpcError(e: unknown): e is RpcError {
  return typeof e === 'object' && e !== null && 'code' in e && 'message' in e
}

/**
 * Fetch account from {@link HORIZON_URL}.
 * If RPC returns 404 or 405, then the account has not yet been created/funded.
 * In that case, hit {@link FRIENDBOT_URL} to fund it, then re-query RPC to get
 * its up-to-date balance.
 */
async function ensureAccountFunded(publicKey: string): Promise<void> {
  try {
    await server.getAccount(publicKey)
  } catch (e: unknown) {
    if (isRpcError(e) && e.code === -32600) {
      const { friendbotUrl } = await server.getNetwork()
      await fetch(`${friendbotUrl}?addr=${publicKey}`)
      await server.getAccount(publicKey)
    } else {
      // re-throw
      throw e
    }
  }
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
      await ensureAccountFunded(window.sorobanUserAddress)
    } catch (e: unknown) {
      console.error(e)
    }
  }
  render()
})();
