/// <reference types="node" />
import { Buffer } from "buffer";
export * from './constants';
export * from './server';
export * from './invoke';
export declare function initialize(admin: Address, decimal: u32, name: Buffer, symbol: Buffer): Promise<void>;
export declare function allowance(from: Address, spender: Address): Promise<i128>;
export declare function incr_allow(from: Address, spender: Address, amount: i128): Promise<void>;
export declare function decr_allow(from: Address, spender: Address, amount: i128): Promise<void>;
export declare function balance(id: Address): Promise<i128>;
export declare function spendable(id: Address): Promise<i128>;
export declare function authorized(id: Address): Promise<boolean>;
export declare function xfer(from: Address, to: Address, amount: i128): Promise<void>;
export declare function xfer_from(spender: Address, from: Address, to: Address, amount: i128): Promise<void>;
export declare function burn(from: Address, amount: i128): Promise<void>;
export declare function burn_from(spender: Address, from: Address, amount: i128): Promise<void>;
export declare function clawback(admin: Address, from: Address, amount: i128): Promise<void>;
export declare function set_auth(admin: Address, id: Address, authorize: boolean): Promise<void>;
/**
* Mint tokens to the `to` Address
* This function is only callable by the contract administrator.
*
* # Arguments
* * `admin` - The Address of the contract administrator
* * `to` - The Address to mint tokens to
* * `amount` - The amount of smallest possible token fractions to mint (remember to multiply
* by `decimals` to get the actual amount of tokens to mint)
*/
export declare function mint(admin: Address, to: Address, amount: i128): Promise<void>;
/**
* Mint one token to yourself.
*
* # Arguments
* * `to` - The Address to mint a token to. Must also be the signer/caller.
*/
export declare function token_plz(to: Address): Promise<void>;
export declare function set_admin(admin: Address, new_admin: Address): Promise<void>;
export declare function decimals(): Promise<u32>;
export declare function name(): Promise<Buffer>;
export declare function symbol(): Promise<Buffer>;
export interface AllowanceDataKey {
    from: Address;
    spender: Address;
}
export type u32 = number;
export type i32 = number;
export type u64 = bigint;
export type i64 = bigint;
export type u128 = bigint;
export type i128 = bigint;
export type u256 = bigint;
export type i256 = bigint;
export type Address = string;
