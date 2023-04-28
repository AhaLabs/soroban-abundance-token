/// <reference types="astro/client" />

interface Window {
  hasFreighter?: boolean
  sorobanUserAddress?: string
  tokenSymbol: string
  xlmBalance?: number
  freighterNetwork?: {
    network: string
    networkUrl: string
    networkPassphrase: string
  }
}
