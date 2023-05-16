import * as SorobanClient from 'soroban-client';
export * from './server';
export * from './invoke';
export type Simulation = NonNullable<SorobanClient.SorobanRpc.SimulateTransactionResponse['results']>[0];
export type InvokeArgs = {
    method: string;
    args?: any[];
    sign?: boolean;
};
/**
 * Get the symbol for the Abundance token.
 * Caches the value in-memory so it only fetches once per page load, since it's unlikely to change.
 * @returns The symbol for the Abundance token.
 */
export declare function symbol(): Promise<string>;
export declare function balance({ id }: {
    id: string;
}): Promise<BigInt>;
export declare function decimals(): Promise<number>;
export declare function tokenPlz({ id }: {
    id?: string;
}): Promise<void>;
