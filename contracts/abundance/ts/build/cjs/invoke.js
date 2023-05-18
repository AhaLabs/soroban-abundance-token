"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoke = exports.getAccount = void 0;
const freighter_api_1 = require("@stellar/freighter-api");
const SorobanClient = require("soroban-client");
const buffer_1 = require("buffer");
const constants_1 = require("./constants");
const server_1 = require("./server");
if (typeof window !== 'undefined') {
    window.Buffer = window.Buffer || buffer_1.Buffer;
}
/**
 * Get account details from the Soroban network for the publicKey currently
 * selected in Freighter. If not connected to Freighter, throws errors. Will
 * pop up Freighter's modal to request user permissions, if this hasn't been
 * done already.
 */
async function getAccount() {
    if (!await (0, freighter_api_1.isConnected)()) {
        throw new Error('Freighter not connected');
    }
    const publicKey = await (0, freighter_api_1.getPublicKey)();
    if (!publicKey) {
        throw new Error('Freighter not initialized');
    }
    return await server_1.Server.getAccount(publicKey);
}
exports.getAccount = getAccount;
async function invoke({ method, args = [], sign = true }) {
    const account = await getAccount();
    const contract = new SorobanClient.Contract(constants_1.CONTRACT_ID);
    let tx = new SorobanClient.TransactionBuilder(account, {
        fee: '100',
        networkPassphrase: constants_1.NETWORK_PASSPHRASE,
    })
        .addOperation(contract.call(method, ...args))
        .setTimeout(SorobanClient.TimeoutInfinite)
        .build();
    if (sign) {
        // Simulate the tx to discover the storage footprint, and update the
        // tx to include it. If you already know the storage footprint you
        // can use `addFootprint` to add it yourself, skipping this step.
        tx = await server_1.Server.prepareTransaction(tx, constants_1.NETWORK_PASSPHRASE);
        // sign with Freighter
        const signed = await (0, freighter_api_1.signTransaction)(tx.toXDR(), {
            network: constants_1.NETWORK_NAME,
            networkPassphrase: constants_1.NETWORK_PASSPHRASE,
        });
        // re-assemble with signed tx
        tx = SorobanClient.TransactionBuilder.fromXDR(signed, constants_1.NETWORK_PASSPHRASE);
        const sendTransactionResponse = await server_1.Server.sendTransaction(tx);
        let getTransactionResponse = await server_1.Server.getTransaction(sendTransactionResponse.hash);
        const secondsToWait = 10;
        const waitUntil = new Date((Date.now() + secondsToWait * 1000)).valueOf();
        while ((Date.now() < waitUntil) && getTransactionResponse.status === "NOT_FOUND") {
            // Wait a second
            await new Promise(resolve => setTimeout(resolve, 1000));
            // See if the transaction is complete
            getTransactionResponse = await server_1.Server.getTransaction(sendTransactionResponse.hash);
        }
        if (getTransactionResponse.status === "NOT_FOUND") {
            console.log(`Waited ${secondsToWait} seconds for transaction to complete, but it did not. Returning anyway. Check the transaction status manually. Info: ${JSON.stringify(sendTransactionResponse, null, 2)}`);
        }
        return getTransactionResponse;
    }
    const { results } = await server_1.Server.simulateTransaction(tx);
    if (!results || results[0] === undefined) {
        throw new Error("Invalid response from simulateTransaction");
    }
    return results[0];
}
exports.invoke = invoke;
