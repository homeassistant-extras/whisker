/** Flush debounced entity subscription resubscribes between tests. */
export const mochaHooks = {
  afterEach() {
    return new Promise<void>((resolve) => setTimeout(resolve, 60));
  },
};
