import * as SorobanClient from 'soroban-client';
import type { Account } from 'soroban-client';
import { Server } from './server';
type Simulation = NonNullable<SorobanClient.SorobanRpc.SimulateTransactionResponse['results']>[0];
type TxResponse = Awaited<ReturnType<typeof Server.getTransaction>>;
type InvokeArgs = {
    method: string;
    args?: any[];
    sign?: boolean;
};
/**
 * Get account details from the Soroban network for the publicKey currently
 * selected in Freighter. If not connected to Freighter, throws errors. Will
 * pop up Freighter's modal to request user permissions, if this hasn't been
 * done already.
 */
export declare function getAccount(): Promise<Account>;
/**
 * Invoke a method on the Abundance token contract.
 *
 * @param {string} obj.method - The method to invoke.
 * @param {any[]} obj.args - The arguments to pass to the method.
 * @param {boolean} obj.sign - Whether to sign the transaction with Freighter.
 * @returns The transaction response, or the simulation result if `sign` is false.
 */
export declare function invoke(args: InvokeArgs & {
    sign: false;
}): Promise<Simulation>;
export declare function invoke(args: InvokeArgs & {
    sign: true;
}): Promise<TxResponse>;
export declare function invoke(args: InvokeArgs & {
    sign?: undefined;
}): Promise<TxResponse>;
export {};
