"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenPlz = exports.decimals = exports.balance = exports.symbol = void 0;
const SorobanClient = require("soroban-client");
const buffer_1 = require("buffer");
const convert_1 = require("./convert");
const invoke_1 = require("./invoke");
__exportStar(require("./constants"), exports);
__exportStar(require("./server"), exports);
__exportStar(require("./invoke"), exports);
if (typeof window !== 'undefined') {
    window.Buffer = window.Buffer || buffer_1.Buffer;
}
/**
 * Get the symbol for the Abundance token.
 * Caches the value in-memory so it only fetches once per page load, since it's unlikely to change.
 * @returns The symbol for the Abundance token.
 */
async function symbol() {
    const { xdr } = await (0, invoke_1.invoke)({ method: 'symbol', sign: false });
    const scVal = SorobanClient.xdr.ScVal.fromXDR(xdr, 'base64');
    ///@ts-expect-error
    return scVal.value()?.toString() ?? '';
}
exports.symbol = symbol;
async function balance({ id }) {
    if (!id) {
        throw new Error('You need to specify an account `id` for which to get a balance:\n\n' +
            '  getBalance({ id: "G..." })`');
    }
    const { xdr } = await (0, invoke_1.invoke)({
        method: 'balance',
        args: [SorobanClient.Address.fromString(id).toScVal()],
        sign: false,
    });
    const scVal = SorobanClient.xdr.ScVal.fromXDR(buffer_1.Buffer.from(xdr, 'base64'));
    return (0, convert_1.scvalToBigInt)(scVal);
}
exports.balance = balance;
async function decimals() {
    const { xdr } = await (0, invoke_1.invoke)({
        method: 'decimals',
        sign: false,
    });
    const scVal = SorobanClient.xdr.ScVal.fromXDR(buffer_1.Buffer.from(xdr, 'base64'));
    return Number((0, convert_1.scvalToBigInt)(scVal));
}
exports.decimals = decimals;
async function tokenPlz({ id = "" }) {
    if (!id) {
        throw new Error('You need to specify an account `id` for which to mint a token:\n\n' +
            '  tokenPlz({ id: "G..." })`');
    }
    await (0, invoke_1.invoke)({
        method: 'token_plz',
        args: [SorobanClient.Address.fromString(id).toScVal()],
    });
}
exports.tokenPlz = tokenPlz;
