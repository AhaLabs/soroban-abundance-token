
import * as SorobanClient from 'soroban-client'
import { Buffer } from "buffer";
import { scvalToBigInt } from './convert';

window.Buffer = window.Buffer || Buffer;

export type Simulation = NonNullable<SorobanClient.SorobanRpc.SimulateTransactionResponse['results']>[0]

export type InvokeArgs = {
    method: string
    args?: any[]
    sign?: boolean
}
export interface Invoker {
    invoke(args: InvokeArgs & { sign?: false }): Promise<Simulation>;
}

export class Contract {
    static ID = '2c6c3b8ba9923d029d8ef7eb80080384b1da32bcf0698290119fdfbf3f2a01de'
    constructor(public invoker: Invoker) { }


    /**
    * Get the symbol for the Abundance token.
    * Caches the value in-memory so it only fetches once per page load, since it's unlikely to change.
    * @returns The symbol for the Abundance token.
 */
    async symbol(): Promise<string> {
        const { xdr } = await this.invoker.invoke({ method: 'symbol', sign: false })
        const scVal = SorobanClient.xdr.ScVal.fromXDR(xdr, 'base64')
        let val = scVal.value();
        ///@ts-ignore
        return scVal.value()?.toString() ?? ''
    }

    async balance({ id }: { id: string }): Promise<BigInt | number> {
        if (!id) {
            throw new Error(
                'You need to specify an account `id` for which to get a balance:\n\n' +
                '  getBalance({ id: "G..." })`'
            )
        }
        const { xdr } = await this.invoker.invoke({
            method: 'balance',
            args: [SorobanClient.Address.fromString(id).toScVal()],
            sign: false,
        })
        const scVal = SorobanClient.xdr.ScVal.fromXDR(Buffer.from(xdr, 'base64'))
        const undivided = scvalToBigInt(scVal)
        const decimals = await this.decimals()
        // @ts-ignore 
        const divided = undivided < BigInt(Number.MAX_SAFE_INTEGER)
            ? Number(undivided) / (10 ** decimals)
            // @ts-expect-error TS is very confused by BigInt division
            : (undivided / (10n ** BigInt(decimals))) as unknown as BigInt
        return divided
    }

    async decimals(): Promise<number> {
        const { xdr } = await this.invoker.invoke({
            method: 'decimals',
            sign: false,
        })
        const scVal = SorobanClient.xdr.ScVal.fromXDR(Buffer.from(xdr, 'base64'))
        return Number(scvalToBigInt(scVal))
    }

    async tokenPlz({ id = "" }): Promise<void> {
        if (!id) {
            throw new Error(
                'You need to specify an account `id` for which to mint a token:\n\n' +
                '  tokenPlz({ id: "G..." })`'
            )
        }
        await this.invoker.invoke({
            method: 'token_plz',
            args: [SorobanClient.Address.fromString(id).toScVal()],
        })
    }


}

export interface SorobanContract {
    new(invoker: InvokeArgs & { sign?: false }): SorobanContract;
}