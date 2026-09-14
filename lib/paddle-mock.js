// UI-only stand-in for the payment provider's browser SDK. The real checkout
// mounts a hosted card form; this copy has no keys, so it resolves to a no-op.
export async function initializePaddle() {
  return {
    Checkout: {
      open() {
        console.info('Checkout is disabled in the UI-only build.')
      },
      close() {},
      updateCheckout() {},
    },
    Update() {},
  }
}
