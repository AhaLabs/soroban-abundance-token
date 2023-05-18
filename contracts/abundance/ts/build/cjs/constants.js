"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPC_URL = exports.NETWORK_PASSPHRASE = exports.NETWORK_NAME = exports.CONTRACT_ID = void 0;
/**
 * The Soroban contract ID for the `abundance-token` contract.
 *
 * You can override this by setting a `SOROBAN_ABUNDANCE_TOKEN_CONTRACT_ID` or
 * `PUBLIC_SOROBAN_ABUNDANCE_TOKEN_CONTRACT_ID` environment variable.
 */
exports.CONTRACT_ID = process.env.PUBLIC_SOROBAN_ABUNDANCE_TOKEN_CONTRACT_ID
    ?? process.env.SOROBAN_ABUNDANCE_TOKEN_CONTRACT_ID
    ?? '2c6c3b8ba9923d029d8ef7eb80080384b1da32bcf0698290119fdfbf3f2a01de';
/**
 * Matches the name given by Freighter's `getNetworkDetails().network` for the network used to initialize this library.
 *
 * You can override this by setting a `SOROBAN_NETWORK_NAME` or
 * `PUBLIC_SOROBAN_NETWORK_NAME` environment variable.
 */
exports.NETWORK_NAME = process.env.PUBLIC_SOROBAN_NETWORK_NAME
    ?? process.env.SOROBAN_NETWORK_NAME
    ?? 'FUTURENET';
/**
 * The Soroban network passphrase used to initialize this library.
 *
 * You can override this by setting a `SOROBAN_NETWORK_PASSPHRASE` or
 * `PUBLIC_SOROBAN_NETWORK_PASSPHRASE` environment variable.
 */
exports.NETWORK_PASSPHRASE = process.env.PUBLIC_SOROBAN_NETWORK_PASSPHRASE
    ?? process.env.SOROBAN_NETWORK_PASSPHRASE
    ?? 'Test SDF Future Network ; October 2022';
/**
 * The Soroban RPC endpoint used to initialize this library.
 *
 * You can override this by setting a `SOROBAN_RPC_URL` or
 * `PUBLIC_SOROBAN_RPC_URL` environment variable.
 */
exports.RPC_URL = process.env.PUBLIC_SOROBAN_RPC_URL
    ?? process.env.SOROBAN_RPC_URL
    ?? 'https://rpc-futurenet.stellar.org:443/soroban/rpc';
