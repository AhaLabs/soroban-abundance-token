import * as SorobanClient from 'soroban-client';
export declare function scvalToBigInt(scval: SorobanClient.xdr.ScVal | undefined): BigInt;
export declare function xdrUint64ToNumber(value: SorobanClient.xdr.Uint64): number;
export declare function scvalToString(value: SorobanClient.xdr.ScVal): string | undefined;
