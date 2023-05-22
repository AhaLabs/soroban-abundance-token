import * as SorobanClient from 'soroban-client';
import { xdr } from 'soroban-client';
import { Buffer } from "buffer";
import { scValToJs } from './convert';
import { invoke } from './invoke';
export * from './constants';
export * from './server';
export * from './invoke';
;
export class Ok {
    value;
    kind = 'ok';
    constructor(value) {
        this.value = value;
    }
    unwrap() {
        return this.value;
    }
    map(f) {
        return new Ok(f(this.value));
    }
    mapErr(_) {
        return this;
    }
}
export class Err {
    message;
    kind = 'err';
    constructor(message) {
        this.message = message;
    }
    unwrap() {
        throw new Error(this.message);
    }
    map(_) {
        return this;
    }
    mapErr(f) {
        return new Err(f(this.message));
    }
}
window.Buffer = window.Buffer || Buffer;
/**
 * @signme
 */
export async function initialize({ admin, decimal, name, symbol }) {
    let invokeArgs = { sign: true, method: 'initialize', args: [((i) => SorobanClient.Address.fromString(i).toScVal())(admin),
            ((i) => xdr.ScVal.scvU32(i))(decimal),
            ((i) => xdr.ScVal.scvBytes(i))(name),
            ((i) => xdr.ScVal.scvBytes(i))(symbol)], };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
}
export async function allowance({ from, spender }) {
    let invokeArgs = { method: 'allowance', args: [((i) => SorobanClient.Address.fromString(i).toScVal())(from),
            ((i) => SorobanClient.Address.fromString(i).toScVal())(spender)], };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return scValToJs(response.xdr);
}
/**
 * @signme
 */
export async function incr_allow({ from, spender, amount }) {
    let invokeArgs = { sign: true, method: 'incr_allow', args: [((i) => SorobanClient.Address.fromString(i).toScVal())(from),
            ((i) => SorobanClient.Address.fromString(i).toScVal())(spender),
            ((i) => xdr.ScVal.scvI128(xdr.Int128Parts.fromXDR(i.toString(16), 'hex')))(amount)], };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
}
/**
 * @signme
 */
export async function decr_allow({ from, spender, amount }) {
    let invokeArgs = { sign: true, method: 'decr_allow', args: [((i) => SorobanClient.Address.fromString(i).toScVal())(from),
            ((i) => SorobanClient.Address.fromString(i).toScVal())(spender),
            ((i) => xdr.ScVal.scvI128(xdr.Int128Parts.fromXDR(i.toString(16), 'hex')))(amount)], };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
}
export async function balance({ id }) {
    let invokeArgs = { method: 'balance', args: [((i) => SorobanClient.Address.fromString(i).toScVal())(id)], };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return scValToJs(response.xdr);
}
export async function spendable({ id }) {
    let invokeArgs = { method: 'spendable', args: [((i) => SorobanClient.Address.fromString(i).toScVal())(id)], };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return scValToJs(response.xdr);
}
export async function authorized({ id }) {
    let invokeArgs = { method: 'authorized', args: [((i) => SorobanClient.Address.fromString(i).toScVal())(id)], };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return scValToJs(response.xdr);
}
/**
 * @signme
 */
export async function xfer({ from, to, amount }) {
    let invokeArgs = { sign: true, method: 'xfer', args: [((i) => SorobanClient.Address.fromString(i).toScVal())(from),
            ((i) => SorobanClient.Address.fromString(i).toScVal())(to),
            ((i) => xdr.ScVal.scvI128(xdr.Int128Parts.fromXDR(i.toString(16), 'hex')))(amount)], };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
}
/**
 * @signme
 */
export async function xfer_from({ spender, from, to, amount }) {
    let invokeArgs = { sign: true, method: 'xfer_from', args: [((i) => SorobanClient.Address.fromString(i).toScVal())(spender),
            ((i) => SorobanClient.Address.fromString(i).toScVal())(from),
            ((i) => SorobanClient.Address.fromString(i).toScVal())(to),
            ((i) => xdr.ScVal.scvI128(xdr.Int128Parts.fromXDR(i.toString(16), 'hex')))(amount)], };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
}
/**
 * @signme
 */
export async function burn({ from, amount }) {
    let invokeArgs = { sign: true, method: 'burn', args: [((i) => SorobanClient.Address.fromString(i).toScVal())(from),
            ((i) => xdr.ScVal.scvI128(xdr.Int128Parts.fromXDR(i.toString(16), 'hex')))(amount)], };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
}
/**
 * @signme
 */
export async function burn_from({ spender, from, amount }) {
    let invokeArgs = { sign: true, method: 'burn_from', args: [((i) => SorobanClient.Address.fromString(i).toScVal())(spender),
            ((i) => SorobanClient.Address.fromString(i).toScVal())(from),
            ((i) => xdr.ScVal.scvI128(xdr.Int128Parts.fromXDR(i.toString(16), 'hex')))(amount)], };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
}
/**
 * @signme
 */
export async function clawback({ admin, from, amount }) {
    let invokeArgs = { sign: true, method: 'clawback', args: [((i) => SorobanClient.Address.fromString(i).toScVal())(admin),
            ((i) => SorobanClient.Address.fromString(i).toScVal())(from),
            ((i) => xdr.ScVal.scvI128(xdr.Int128Parts.fromXDR(i.toString(16), 'hex')))(amount)], };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
}
/**
 * @signme
 */
export async function set_auth({ admin, id, authorize }) {
    let invokeArgs = { sign: true, method: 'set_auth', args: [((i) => SorobanClient.Address.fromString(i).toScVal())(admin),
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
export async function mint({ admin, to, amount }) {
    let invokeArgs = { sign: true, method: 'mint', args: [((i) => SorobanClient.Address.fromString(i).toScVal())(admin),
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
export async function token_plz({ to }) {
    let invokeArgs = { sign: true, method: 'token_plz', args: [((i) => SorobanClient.Address.fromString(i).toScVal())(to)], };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
}
/**
 * @signme
 */
export async function set_admin({ admin, new_admin }) {
    let invokeArgs = { sign: true, method: 'set_admin', args: [((i) => SorobanClient.Address.fromString(i).toScVal())(admin),
            ((i) => SorobanClient.Address.fromString(i).toScVal())(new_admin)], };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
}
export async function decimals() {
    let invokeArgs = { method: 'decimals', };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return scValToJs(response.xdr);
}
export async function name() {
    let invokeArgs = { method: 'name', };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return scValToJs(response.xdr);
}
export async function symbol() {
    let invokeArgs = { method: 'symbol', };
    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return scValToJs(response.xdr);
}
function AllowanceDataKeyToXDR(allowanceDataKey) {
    if (!allowanceDataKey) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("from"), val: ((i) => SorobanClient.Address.fromString(i).toScVal())(allowanceDataKey.from) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("spender"), val: ((i) => SorobanClient.Address.fromString(i).toScVal())(allowanceDataKey.spender) })
    ];
    return xdr.ScVal.scvMap(arr);
}
