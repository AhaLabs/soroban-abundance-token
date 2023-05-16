import * as SorobanClient from 'soroban-client'
import { RPC_URL } from './constants'

export const Server = new SorobanClient.Server(RPC_URL);
