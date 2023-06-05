/**
 * Format a balance for display to user.
 *
 * If the balance is a number smaller than the max safe integer, then divide it
 * as a number and return it so that decimal places will be respected.
 * Otherwise, return it as a BigInt, which does not respect decimal places.
 * This is probably ok since the numbers will be so huge.
 */
export function formatBalance(undivided: BigInt, decimals: number): BigInt | number {
  return undivided.valueOf() < BigInt(Number.MAX_SAFE_INTEGER)
    ? Number(undivided) / (10 ** decimals)
    : (undivided.valueOf() / (10n ** BigInt(decimals))) as unknown as BigInt
}
