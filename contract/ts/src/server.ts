import * as SorobanClient from 'soroban-client'
import { RPC_URL } from './constants'

export const server = new SorobanClient.Server(RPC_URL);
