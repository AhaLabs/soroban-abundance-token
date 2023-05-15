import { signTransaction } from '@stellar/freighter-api'
import * as SorobanClient from 'soroban-client'
import { Buffer } from "buffer";
import type { Memo, MemoType, Operation, Transaction } from 'soroban-client';
import { server } from './server'
import * as contract from "../../../gen/contract"
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

export function getContract(): contract.Contract {
  return new contract.Contract({ invoke })
}

