import * as SorobanClient from 'soroban-client'

const RPC_URL = 'https://rpc-futurenet.stellar.org:443/soroban/rpc'

export const server = new SorobanClient.Server(RPC_URL);
