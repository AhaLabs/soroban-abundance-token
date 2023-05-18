/// <reference types="node" />
import { Buffer } from "buffer";
export * from './constants';
export * from './server';
export * from './invoke';
export type u32 = number;
export type i32 = number;
export type u64 = bigint;
export type i64 = bigint;
export type u128 = bigint;
export type i128 = bigint;
export type u256 = bigint;
export type i256 = bigint;
export type Address = string;
/**
 * @signme
 */
export declare function initialize({ admin, decimal, name, symbol }: {
    admin: Address;
    decimal: u32;
    name: Buffer;
    symbol: Buffer;
}): Promise<void>;
export declare function allowance({ from, spender }: {
    from: Address;
    spender: Address;
}): Promise<i128>;
/**
 * @signme
 */
export declare function incr_allow({ from, spender, amount }: {
    from: Address;
    spender: Address;
    amount: i128;
}): Promise<void>;
/**
 * @signme
 */
export declare function decr_allow({ from, spender, amount }: {
    from: Address;
    spender: Address;
    amount: i128;
}): Promise<void>;
export declare function balance({ id }: {
    id: Address;
}): Promise<i128>;
export declare function spendable({ id }: {
    id: Address;
}): Promise<i128>;
export declare function authorized({ id }: {
    id: Address;
}): Promise<boolean>;
/**
 * @signme
 */
export declare function xfer({ from, to, amount }: {
    from: Address;
    to: Address;
    amount: i128;
}): Promise<void>;
/**
 * @signme
 */
export declare function xfer_from({ spender, from, to, amount }: {
    spender: Address;
    from: Address;
    to: Address;
    amount: i128;
}): Promise<void>;
/**
 * @signme
 */
export declare function burn({ from, amount }: {
    from: Address;
    amount: i128;
}): Promise<void>;
/**
 * @signme
 */
export declare function burn_from({ spender, from, amount }: {
    spender: Address;
    from: Address;
    amount: i128;
}): Promise<void>;
/**
 * @signme
 */
export declare function clawback({ admin, from, amount }: {
    admin: Address;
    from: Address;
    amount: i128;
}): Promise<void>;
/**
 * @signme
 */
export declare function set_auth({ admin, id, authorize }: {
    admin: Address;
    id: Address;
    authorize: boolean;
}): Promise<void>;
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
export declare function mint({ admin, to, amount }: {
    admin: Address;
    to: Address;
    amount: i128;
}): Promise<void>;
/**
 * Mint one token to yourself.
 *
 * # Arguments
 * * `to` - The Address to mint a token to. Must also be the signer/caller.
 *
 * @signme
 */
export declare function token_plz({ to }: {
    to: Address;
}): Promise<void>;
/**
 * @signme
 */
export declare function set_admin({ admin, new_admin }: {
    admin: Address;
    new_admin: Address;
}): Promise<void>;
export declare function decimals(): Promise<u32>;
export declare function name(): Promise<Buffer>;
export declare function symbol(): Promise<Buffer>;
export interface AllowanceDataKey {
    from: Address;
    spender: Address;
}
