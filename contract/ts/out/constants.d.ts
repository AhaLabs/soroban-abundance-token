/**
 * TODO: should this maybe be called ABUNDANCE_TOKEN_ID, to match the `--name`
 * given by to the `soroban contract bindings ts` command?
 */
export declare const CONTRACT_ID: string;
/**
 * Matches the name given by Freighter's `getNetworkDetails().network` for the network used to initialize this library.
 *
 * You can override this by setting a `SOROBAN_NETWORK_NAME` or
 * `PUBLIC_SOROBAN_NETWORK_NAME` environment variable.
 */
export declare const NETWORK_NAME: string;
/**
 * The Soroban network passphrase used to initialize this library.
 *
 * You can override this by setting a `SOROBAN_NETWORK_PASSPHRASE` or
 * `PUBLIC_SOROBAN_NETWORK_PASSPHRASE` environment variable.
 */
export declare const NETWORK_PASSPHRASE: string;
/**
 * The Soroban RPC endpoint used to initialize this library.
 *
 * You can override this by setting a `SOROBAN_RPC_URL` or
 * `PUBLIC_SOROBAN_RPC_URL` environment variable.
 */
export declare const RPC_URL: string;
