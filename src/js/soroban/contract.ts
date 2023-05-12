import { signTransaction } from '@stellar/freighter-api'
import * as SorobanClient from 'soroban-client'
import { Buffer } from "buffer";
import type {Memo, MemoType, Operation, Transaction} from 'soroban-client';
import { server } from './server'
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
  account.incrementSequenceNumber()

  let tx = new SorobanClient.TransactionBuilder(account, {
      fee: '100',
      networkPassphrase: window.freighterNetwork.networkPassphrase,
  })
    .setMinAccountSequence(account.sequenceNumber())
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

export async function getSymbol(): Promise<string> {
  const { xdr } = await invoke({ method: 'symbol', sign: false })
  const scVal = SorobanClient.xdr.ScVal.fromXDR(Buffer.from(xdr, 'base64'))
  return scVal.value()?.toString() ?? ''
}

function i128ScValToBigInt(scVal: SorobanClient.xdr.ScVal): bigint {
  const buf = (scVal.value() as SorobanClient.xdr.Int128Parts).toXDR()
  const hex = buf.toString('hex')
  return BigInt(`0x${hex}`)
}

export async function getBalance({ id }: { id: string }): Promise<bigint> {
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
  return i128ScValToBigInt(scVal)
}

export async function tokenPlz({ id = "" }): Promise<void> {
  if (!id) {
    throw new Error(
      'You need to specify an account `id` for which to mint a token:\n\n' +
      '  tokenPlz({ id: "G..." })`'
    )
  }
  const result = await invoke({
    method: 'token_plz',
    args: [SorobanClient.Address.fromString(id).toScVal()],
  })
  console.log(result)
  console.log(
    `that failed, but why? how do we decode this? maybe something like this?
    SorobanClient.xdr.ScBytes.fromXDR(Buffer.from(result.errorResultXdr, 'base64'))`
  )
  const xdr = result.errorResultXdr && Buffer.from(result.errorResultXdr, 'base64')
  xdr && Object.entries(SorobanClient.xdr).forEach(([key, value]) => {
    if (typeof value === 'object' && 'fromXDR' in value) {
      try {
        const decoded = value.fromXDR(xdr).toString()
        console.log({ trying_to_decode_as: key, decoded })
      } catch (e) {
        // ignore
      }
    }
  })
  debugger
}
