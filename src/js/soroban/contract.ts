import { signTransaction } from '@stellar/freighter-api'
import * as SorobanClient from 'soroban-client'
import { Buffer } from "buffer";
import type {Memo, MemoType, Operation, Transaction} from 'soroban-client';
import { server } from './server'
import { scvalToBigInt } from '../utils/convert'
window.Buffer = window.Buffer || Buffer;

const ABUNDANCE_TOKEN_ID = '2c6c3b8ba9923d029d8ef7eb80080384b1da32bcf0698290119fdfbf3f2a01de'

type Tx = Transaction<Memo<MemoType>, Operation[]>

type Simulation = NonNullable<SorobanClient.SorobanRpc.SimulateTransactionResponse['results']>[0]

type TxResponse = Awaited<ReturnType<typeof server.sendTransaction>>

type InvokeArgs = {
  method: string
  args?: any[]
  sign?: boolean
}

/**
 * Invoke a method on the Abundance token contract.
 *
 * @param {string} obj.method - The method to invoke.
 * @param {any[]} obj.args - The arguments to pass to the method.
 * @param {boolean} obj.sign - Whether to sign the transaction with Freighter.
 * @returns The transaction response, or the simulation result if `sign` is false.
 */
async function invoke(args: InvokeArgs & { sign: false }): Promise<Simulation>;
async function invoke(args: InvokeArgs & { sign: true }): Promise<TxResponse>;
async function invoke(args: InvokeArgs & { sign?: undefined }): Promise<TxResponse>;
async function invoke({ method, args = [], sign = true }: InvokeArgs): Promise<TxResponse | Simulation> {
  if (!window.freighterNetwork || !window.sorobanUserAddress) {
    throw new Error("Freighter not initialized");
  }

  const contract = new SorobanClient.Contract(ABUNDANCE_TOKEN_ID)

  const account = await server.getAccount(window.sorobanUserAddress)

  let tx = new SorobanClient.TransactionBuilder(account, {
      fee: '100',
      networkPassphrase: window.freighterNetwork.networkPassphrase,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(SorobanClient.TimeoutInfinite)
    .build()

  if (sign) {
    // Simulate the tx to discover the storage footprint, and update the
    // tx to include it. If you already know the storage footprint you
    // can use `addFootprint` to add it yourself, skipping this step.
    tx = await server.prepareTransaction(tx, window.freighterNetwork.networkPassphrase) as Tx

    // sign with Freighter
    const signed = await signTransaction(tx.toXDR(), {
      network: window.freighterNetwork.network,
      networkPassphrase: window.freighterNetwork.networkPassphrase,
    })

    // re-assemble with signed tx
    tx = SorobanClient.TransactionBuilder.fromXDR(
      signed,
      window.freighterNetwork.networkPassphrase
    ) as Tx

    return await server.sendTransaction(tx);
  }

  const { results } = await server.simulateTransaction(tx)
  if (!results || results[0] === undefined) {
      throw new Error("Invalid response from simulateTransaction")
  }
  return results[0]
}

/**
 * Get the symbol for the Abundance token.
 * Caches the value in-memory so it only fetches once per page load, since it's unlikely to change.
 * @returns The symbol for the Abundance token.
 */
export async function getSymbol(): Promise<string> {
  if (symbolCache) return symbolCache

  const { xdr } = await invoke({ method: 'symbol', sign: false })
  const scVal = SorobanClient.xdr.ScVal.fromXDR(Buffer.from(xdr, 'base64'))
  symbolCache = scVal.value()?.toString() ?? ''
  return symbolCache
}
let symbolCache: string | undefined

/**
 * Get the balance for an account
 * @param {string} obj.id - The account ID to get the balance for.
 * @returns The balance for the account as a BigInt, if the balance is larger than Number.MAX_SAFE_INTEGER, or `number` if smaller than.
 */
export async function getBalance({ id }: { id: string }): Promise<BigInt | number> {
  if (!id) {
    throw new Error(
      'You need to specify an account `id` for which to get a balance:\n\n' +
      '  getBalance({ id: "G..." })`'
    )
  }
  const { xdr } = await invoke({
    method: 'balance',
    args: [SorobanClient.Address.fromString(id).toScVal()],
    sign: false,
  })
  const scVal = SorobanClient.xdr.ScVal.fromXDR(Buffer.from(xdr, 'base64'))
  const undivided = scvalToBigInt(scVal)
  const decimals = await getDecimals()
  const divided = undivided < BigInt(Number.MAX_SAFE_INTEGER)
    ? Number(undivided) / (10 ** decimals)
    // @ts-expect-error TS is very confused by BigInt division
    : (undivided / (10n ** BigInt(decimals))) as unknown as BigInt
  return divided
}

/**
 * Get the number of decimals for the Abundance token.
 * Caches the value in-memory so it only fetches once per page load, since it's unlikely to change.
 *
 * @returns The number of decimals.
 */
export async function getDecimals(): Promise<number> {
  if (decimalsCache) return decimalsCache

  const { xdr } = await invoke({
    method: 'decimals',
    sign: false,
  })
  const scVal = SorobanClient.xdr.ScVal.fromXDR(Buffer.from(xdr, 'base64'))
  decimalsCache = Number(scvalToBigInt(scVal))
  return decimalsCache
}
let decimalsCache: number | undefined

export async function tokenPlz({ id = "" }): Promise<void> {
  if (!id) {
    throw new Error(
      'You need to specify an account `id` for which to mint a token:\n\n' +
      '  tokenPlz({ id: "G..." })`'
    )
  }
  await invoke({
    method: 'token_plz',
    args: [SorobanClient.Address.fromString(id).toScVal()],
  })
}
