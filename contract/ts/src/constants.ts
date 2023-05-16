/**
 * TODO: should this maybe be called ABUNDANCE_TOKEN_ID, to match the `--name`
 * given by to the `soroban contract bindings ts` command?
 */
export const CONTRACT_ID = import.meta.env.PUBLIC_SOROBAN_CONTRACT_ID
  ?? import.meta.env.SOROBAN_CONTRACT_ID
  ?? '2c6c3b8ba9923d029d8ef7eb80080384b1da32bcf0698290119fdfbf3f2a01de'

/**
 * Matches the name given by Freighter's `getNetworkDetails().network`
 */
export const NETWORK_NAME = import.meta.env.PUBLIC_SOROBAN_NETWORK_NAME
  ?? import.meta.env.SOROBAN_NETWORK_NAME
  ?? 'FUTURENET'

export const NETWORK_PASSPHRASE = import.meta.env.PUBLIC_SOROBAN_NETWORK_PASSPHRASE
  ?? import.meta.env.SOROBAN_NETWORK_PASSPHRASE
  ?? 'Test SDF Future Network ; October 2022'

export const RPC_URL = import.meta.env.PUBLIC_SOROBAN_RPC_URL
  ?? import.meta.env.SOROBAN_RPC_URL
  ?? 'https://rpc-futurenet.stellar.org:443/soroban/rpc'

