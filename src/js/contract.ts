import * as SorobanClient from 'soroban-client'
import { RPC_URL } from './constants'
import { Buffer } from "buffer";
window.Buffer = window.Buffer || Buffer;

const ABUNDANCE_TOKEN_ID = '2c6c3b8ba9923d029d8ef7eb80080384b1da32bcf0698290119fdfbf3f2a01de'
const server = new SorobanClient.Server(RPC_URL);

export async function getSymbol() {
  if (!window.freighterNetwork || !window.sorobanUserAddress) {
    throw new Error("Freighter not initialized");
  }

  const contract = new SorobanClient.Contract(ABUNDANCE_TOKEN_ID)

  const account = new SorobanClient.Account(window.sorobanUserAddress, '0')

  const transaction = new SorobanClient.TransactionBuilder(account, {
      fee: '0',
      networkPassphrase: window.freighterNetwork.networkPassphrase,
  })
    .addOperation(
      contract.call(
        'symbol',
        // SorobanClient.Address.fromString(id).toScVal()
      )
    )
    .setTimeout(SorobanClient.TimeoutInfinite)
    .build();

  const { results } = await server.simulateTransaction(transaction)
  if (!results || results[0] === undefined) {
      throw new Error("Invalid response from simulateTransaction");
  }
  const result = results[0];
  return SorobanClient.xdr.ScVal.fromXDR(Buffer.from(result.xdr, 'base64'));
}
