import * as SorobanClient from 'soroban-client';
import { xdr } from 'soroban-client';
import { Buffer } from "buffer";
import { scValToJs } from './convert';
import { invoke, InvokeArgs } from './invoke';

export * from './constants'
export * from './server'
export * from './invoke'

export type u32 = number;
export type i32 = number;
export type u64 = bigint;
export type i64 = bigint;
export type u128 = bigint;
export type i128 = bigint;
export type u256 = bigint;
export type i256 = bigint;
export type Address = string;
export type Option<T> = T | undefined;

/// Error interface containing the error message
export interface Error_ { message: string };
export type Result<T, E = Error_> = Ok<T, E> | Err<T, E>;

export class Ok<T, E> {
    readonly kind: 'ok' = 'ok';
    constructor(readonly value: T) { }

    unwrap(): T {
        return this.value;
    }

    map<U>(f: (value: T) => U): Result<U, E> {
        return new Ok(f(this.value));
    }

    mapErr<U>(_: (error: E) => U): Result<T, U> {
        return this as unknown as Result<T, U>;
    }
}

export class Err<T, E> {
    readonly kind: 'err' = 'err';
    constructor(readonly message: E) { }

    unwrap(): never {
        throw new Error(this.message as unknown as string);
    }

    map<U>(_: (value: T) => U): Result<U, E> {
        return this as unknown as Result<U, E>;
    }

    mapErr<U>(f: (error: E) => U): Result<T, U> {
        return new Err(f(this.message));
    }
}

window.Buffer = window.Buffer || Buffer;

/**
 * @signme
 */
export async function initialize({admin, decimal, name, symbol}: {admin: Address, decimal: u32, name: Buffer, symbol: Buffer}) {
    let invokeArgs: InvokeArgs = {sign: true, method: 'initialize', args: [((i) => SorobanClient.Address.fromString(i).toScVal())(admin),
        ((i) => xdr.ScVal.scvU32(i))(decimal),
        ((i) => xdr.ScVal.scvBytes(i))(name),
        ((i) => xdr.ScVal.scvBytes(i))(symbol)], };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    
}

export async function allowance({from, spender}: {from: Address, spender: Address}): Promise<i128> {
    let invokeArgs: InvokeArgs = {method: 'allowance', args: [((i) => SorobanClient.Address.fromString(i).toScVal())(from),
        ((i) => SorobanClient.Address.fromString(i).toScVal())(spender)], };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return scValToJs(response.xdr) as i128

    
}

/**
 * @signme
 */
export async function incr_allow({from, spender, amount}: {from: Address, spender: Address, amount: i128}) {
    let invokeArgs: InvokeArgs = {sign: true, method: 'incr_allow', args: [((i) => SorobanClient.Address.fromString(i).toScVal())(from),
        ((i) => SorobanClient.Address.fromString(i).toScVal())(spender),
        ((i) => xdr.ScVal.scvI128(xdr.Int128Parts.fromXDR(i.toString(16), 'hex')))(amount)], };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    
}

/**
 * @signme
 */
export async function decr_allow({from, spender, amount}: {from: Address, spender: Address, amount: i128}) {
    let invokeArgs: InvokeArgs = {sign: true, method: 'decr_allow', args: [((i) => SorobanClient.Address.fromString(i).toScVal())(from),
        ((i) => SorobanClient.Address.fromString(i).toScVal())(spender),
        ((i) => xdr.ScVal.scvI128(xdr.Int128Parts.fromXDR(i.toString(16), 'hex')))(amount)], };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    
}

export async function balance({id}: {id: Address}): Promise<i128> {
    let invokeArgs: InvokeArgs = {method: 'balance', args: [((i) => SorobanClient.Address.fromString(i).toScVal())(id)], };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return scValToJs(response.xdr) as i128

    
}

export async function spendable({id}: {id: Address}): Promise<i128> {
    let invokeArgs: InvokeArgs = {method: 'spendable', args: [((i) => SorobanClient.Address.fromString(i).toScVal())(id)], };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return scValToJs(response.xdr) as i128

    
}

export async function authorized({id}: {id: Address}): Promise<boolean> {
    let invokeArgs: InvokeArgs = {method: 'authorized', args: [((i) => SorobanClient.Address.fromString(i).toScVal())(id)], };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return scValToJs(response.xdr) as boolean

    
}

/**
 * @signme
 */
export async function xfer({from, to, amount}: {from: Address, to: Address, amount: i128}) {
    let invokeArgs: InvokeArgs = {sign: true, method: 'xfer', args: [((i) => SorobanClient.Address.fromString(i).toScVal())(from),
        ((i) => SorobanClient.Address.fromString(i).toScVal())(to),
        ((i) => xdr.ScVal.scvI128(xdr.Int128Parts.fromXDR(i.toString(16), 'hex')))(amount)], };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    
}

/**
 * @signme
 */
export async function xfer_from({spender, from, to, amount}: {spender: Address, from: Address, to: Address, amount: i128}) {
    let invokeArgs: InvokeArgs = {sign: true, method: 'xfer_from', args: [((i) => SorobanClient.Address.fromString(i).toScVal())(spender),
        ((i) => SorobanClient.Address.fromString(i).toScVal())(from),
        ((i) => SorobanClient.Address.fromString(i).toScVal())(to),
        ((i) => xdr.ScVal.scvI128(xdr.Int128Parts.fromXDR(i.toString(16), 'hex')))(amount)], };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    
}

/**
 * @signme
 */
export async function burn({from, amount}: {from: Address, amount: i128}) {
    let invokeArgs: InvokeArgs = {sign: true, method: 'burn', args: [((i) => SorobanClient.Address.fromString(i).toScVal())(from),
        ((i) => xdr.ScVal.scvI128(xdr.Int128Parts.fromXDR(i.toString(16), 'hex')))(amount)], };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    
}

/**
 * @signme
 */
export async function burn_from({spender, from, amount}: {spender: Address, from: Address, amount: i128}) {
    let invokeArgs: InvokeArgs = {sign: true, method: 'burn_from', args: [((i) => SorobanClient.Address.fromString(i).toScVal())(spender),
        ((i) => SorobanClient.Address.fromString(i).toScVal())(from),
        ((i) => xdr.ScVal.scvI128(xdr.Int128Parts.fromXDR(i.toString(16), 'hex')))(amount)], };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    
}

/**
 * @signme
 */
export async function clawback({admin, from, amount}: {admin: Address, from: Address, amount: i128}) {
    let invokeArgs: InvokeArgs = {sign: true, method: 'clawback', args: [((i) => SorobanClient.Address.fromString(i).toScVal())(admin),
        ((i) => SorobanClient.Address.fromString(i).toScVal())(from),
        ((i) => xdr.ScVal.scvI128(xdr.Int128Parts.fromXDR(i.toString(16), 'hex')))(amount)], };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    
}

/**
 * @signme
 */
export async function set_auth({admin, id, authorize}: {admin: Address, id: Address, authorize: boolean}) {
    let invokeArgs: InvokeArgs = {sign: true, method: 'set_auth', args: [((i) => SorobanClient.Address.fromString(i).toScVal())(admin),
        ((i) => SorobanClient.Address.fromString(i).toScVal())(id),
        ((i) => xdr.ScVal.scvBool(i))(authorize)], };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    
}

/**
 * Mint tokens to the `to` Address
 * This function is only callable by the contract administrator.
 * 
 * # Arguments
 * * `admin` - The Address of the contract administrator
 * * `to` - The Address to mint tokens to
 * * `amount` - The amount of smallest possible token fractions to mint (remember to multiply
 * by `decimals` to get the actual amount of tokens to mint)
 * @signme
 */
export async function mint({admin, to, amount}: {admin: Address, to: Address, amount: i128}) {
    let invokeArgs: InvokeArgs = {sign: true, method: 'mint', args: [((i) => SorobanClient.Address.fromString(i).toScVal())(admin),
        ((i) => SorobanClient.Address.fromString(i).toScVal())(to),
        ((i) => xdr.ScVal.scvI128(xdr.Int128Parts.fromXDR(i.toString(16), 'hex')))(amount)], };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    
}

/**
 * Mint one token to yourself.
 * 
 * # Arguments
 * * `to` - The Address to mint a token to. Must also be the signer/caller.
 * 
 * @signme
 */
export async function token_plz({to}: {to: Address}) {
    let invokeArgs: InvokeArgs = {sign: true, method: 'token_plz', args: [((i) => SorobanClient.Address.fromString(i).toScVal())(to)], };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    
}

/**
 * @signme
 */
export async function set_admin({admin, new_admin}: {admin: Address, new_admin: Address}) {
    let invokeArgs: InvokeArgs = {sign: true, method: 'set_admin', args: [((i) => SorobanClient.Address.fromString(i).toScVal())(admin),
        ((i) => SorobanClient.Address.fromString(i).toScVal())(new_admin)], };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    
}

export async function decimals(): Promise<u32> {
    let invokeArgs: InvokeArgs = {method: 'decimals', };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return scValToJs(response.xdr) as u32

    
}

export async function name(): Promise<Buffer> {
    let invokeArgs: InvokeArgs = {method: 'name', };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return scValToJs(response.xdr) as Buffer

    
}

export async function symbol(): Promise<Buffer> {
    let invokeArgs: InvokeArgs = {method: 'symbol', };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return scValToJs(response.xdr) as Buffer

    
}

export interface AllowanceDataKey {
  from: Address;
  spender: Address;
}

function AllowanceDataKeyToXDR(allowanceDataKey?: AllowanceDataKey): xdr.ScVal {
    if (!allowanceDataKey) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("from"), val: ((i)=>SorobanClient.Address.fromString(i).toScVal())(allowanceDataKey.from)}),
        new xdr.ScMapEntry({key: ((i)=>xdr.ScVal.scvSymbol(i))("spender"), val: ((i)=>SorobanClient.Address.fromString(i).toScVal())(allowanceDataKey.spender)})
        ];
    return xdr.ScVal.scvMap(arr);
}

