import * as SorobanClient from 'soroban-client';
export type Simulation = NonNullable<SorobanClient.SorobanRpc.SimulateTransactionResponse['results']>[0];
export type InvokeArgs = {
    method: string;
    args?: any[];
    sign?: boolean;
};
export interface Invoker {
    invoke(args: InvokeArgs & {
        sign?: false;
    }): Promise<Simulation>;
}
export declare class Contract {
    invoker: Invoker;
    static ID: string;
    constructor(invoker: Invoker);
    /**
    * Get the symbol for the Abundance token.
    * Caches the value in-memory so it only fetches once per page load, since it's unlikely to change.
    * @returns The symbol for the Abundance token.
 */
    symbol(): Promise<string>;
    balance({ id }: {
        id: string;
    }): Promise<BigInt | number>;
    decimals(): Promise<number>;
    tokenPlz({ id }: {
        id?: string;
    }): Promise<void>;
}
export interface SorobanContract {
    new (invoker: InvokeArgs & {
        sign?: false;
    }): SorobanContract;
}
