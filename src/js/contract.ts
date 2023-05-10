import * as SorobanClient from 'soroban-client'
import { RPC_URL } from './constants'
import { Buffer } from "buffer";
window.Buffer = window.Buffer || Buffer;

const ABUNDANCE_TOKEN_ID = '2c6c3b8ba9923d029d8ef7eb80080384b1da32bcf0698290119fdfbf3f2a01de'
const server = new SorobanClient.Server(RPC_URL);

async function invoke(method: string, ...args: any[]) {
  if (!window.freighterNetwork || !window.sorobanUserAddress) {
    throw new Error("Freighter not initialized");
  }

  const contract = new SorobanClient.Contract(ABUNDANCE_TOKEN_ID)

  const account = new SorobanClient.Account(window.sorobanUserAddress, '0')

  const transaction = new SorobanClient.TransactionBuilder(account, {
      fee: '0',
      networkPassphrase: window.freighterNetwork.networkPassphrase,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(SorobanClient.TimeoutInfinite)
    .build();

  const { results } = await server.simulateTransaction(transaction)
  if (!results || results[0] === undefined) {
      throw new Error("Invalid response from simulateTransaction");
  }
  const result = results[0];
  return SorobanClient.xdr.ScVal.fromXDR(Buffer.from(result.xdr, 'base64'));
}

export async function getSymbol(): Promise<string> {
  return (await invoke('symbol'))?.value()?.toString() ?? ''
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
  const scVal = await invoke(
    'balance',
    SorobanClient.Address.fromString(id).toScVal()
  )
  return i128ScValToBigInt(scVal)
}
