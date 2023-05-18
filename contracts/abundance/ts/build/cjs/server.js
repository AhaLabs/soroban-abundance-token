"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const SorobanClient = require("soroban-client");
const constants_1 = require("./constants");
/**
 * SorobanClient.Server instance, initialized using {@link RPC_URL} used to
 * initialize this library.
 */
exports.Server = new SorobanClient.Server(constants_1.RPC_URL);
