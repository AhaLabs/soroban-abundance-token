import { signTransaction } from '@stellar/freighter-api'
import * as SorobanClient from 'soroban-client'
import { RPC_URL } from './constants'
import { Buffer } from "buffer";
import type {Memo, MemoType, Operation, Transaction} from 'soroban-client';
window.Buffer = window.Buffer || Buffer;

const ABUNDANCE_TOKEN_ID = '2c6c3b8ba9923d029d8ef7eb80080384b1da32bcf0698290119fdfbf3f2a01de'
const server = new SorobanClient.Server(RPC_URL);

type Tx = Transaction<Memo<MemoType>, Operation[]>

async function invoke(
  { method, args = [], getFootprint = true }:
  { method: string, args?: any[], getFootprint?: boolean }
) {
  if (!window.freighterNetwork || !window.sorobanUserAddress) {
    throw new Error("Freighter not initialized");
  }

  const contract = new SorobanClient.Contract(ABUNDANCE_TOKEN_ID)

  const account = new SorobanClient.Account(window.sorobanUserAddress, '0')

  let tx = new SorobanClient.TransactionBuilder(account, {
      fee: '0',
      networkPassphrase: window.freighterNetwork.networkPassphrase,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(SorobanClient.TimeoutInfinite)
    .build()

  if (getFootprint) {
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

    const txResponse = await server.sendTransaction(tx);

    const result = txResponse.errorResultXdr

    if (!result) {
        throw new Error("Invalid response from sendTransaction");
    }

    const asBytes = Buffer.from(result, 'base64')
    return SorobanClient.xdr.ScBytes.fromXDR(asBytes);
  }

  const { results } = await server.simulateTransaction(tx)
  if (!results || results[0] === undefined) {
      throw new Error("Invalid response from simulateTransaction")
  }
  const result = results[0]
  return SorobanClient.xdr.ScVal.fromXDR(Buffer.from(result.xdr, 'base64'))
}

export async function getSymbol(): Promise<string> {
  return (await invoke({
    method: 'symbol',
    getFootprint: false,
  }))?.value()?.toString() ?? ''
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
  const scVal = await invoke({
    method: 'balance',
    args: [SorobanClient.Address.fromString(id).toScVal()],
    getFootprint: false,
  })
  return i128ScValToBigInt(scVal)
}

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
