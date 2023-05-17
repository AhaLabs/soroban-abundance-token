import { isConnected, getPublicKey, signTransaction, } from "@stellar/freighter-api";
import * as SorobanClient from 'soroban-client';
import { Buffer } from "buffer";
import { NETWORK_NAME, NETWORK_PASSPHRASE, CONTRACT_ID } from './constants';
import { Server } from './server';
window.Buffer = window.Buffer || Buffer;
/**
 * Get account details from the Soroban network for the publicKey currently
 * selected in Freighter. If not connected to Freighter, throws errors. Will
 * pop up Freighter's modal to request user permissions, if this hasn't been
 * done already.
 */
export async function getAccount() {
    if (!await isConnected()) {
        throw new Error('Freighter not connected');
    }
    const publicKey = await getPublicKey();
    if (!publicKey) {
        throw new Error('Freighter not initialized');
    }
    return await Server.getAccount(publicKey);
}
export async function invoke({ method, args = [], sign = false }) {
    const account = await getAccount();
    const contract = new SorobanClient.Contract(CONTRACT_ID);
    let tx = new SorobanClient.TransactionBuilder(account, {
        fee: '100',
        networkPassphrase: NETWORK_PASSPHRASE,
    })
        .addOperation(contract.call(method, ...args))
        .setTimeout(SorobanClient.TimeoutInfinite)
        .build();
    if (sign) {
        // Simulate the tx to discover the storage footprint, and update the
        // tx to include it. If you already know the storage footprint you
        // can use `addFootprint` to add it yourself, skipping this step.
        tx = await Server.prepareTransaction(tx, NETWORK_PASSPHRASE);
        // sign with Freighter
        const signed = await signTransaction(tx.toXDR(), {
            network: NETWORK_NAME,
            networkPassphrase: NETWORK_PASSPHRASE,
        });
        // re-assemble with signed tx
        tx = SorobanClient.TransactionBuilder.fromXDR(signed, NETWORK_PASSPHRASE);
        const sendTransactionResponse = await Server.sendTransaction(tx);
        let getTransactionResponse = await Server.getTransaction(sendTransactionResponse.hash);
        const secondsToWait = 10;
        const waitUntil = new Date((Date.now() + secondsToWait * 1000)).valueOf();
        while ((Date.now() < waitUntil) && getTransactionResponse.status === "NOT_FOUND") {
            // Wait a second
            await new Promise(resolve => setTimeout(resolve, 1000));
            // See if the transaction is complete
            getTransactionResponse = await Server.getTransaction(sendTransactionResponse.hash);
        }
        if (getTransactionResponse.status === "NOT_FOUND") {
            console.log(`Waited ${secondsToWait} seconds for transaction to complete, but it did not. Returning anyway. Check the transaction status manually. Info: ${JSON.stringify(sendTransactionResponse, null, 2)}`);
        }
        return getTransactionResponse;
    }
    const { results } = await Server.simulateTransaction(tx);
    if (!results || results[0] === undefined) {
        throw new Error("Invalid response from simulateTransaction");
    }
    return results[0];
}
