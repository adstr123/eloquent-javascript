expect.extend({
  /**
   * Array contains no duplicate elements
   * @param received
   */
  toHaveUnique(received) {
    const pass =
      Array.isArray(received) && new Set(received).size === received.length;
    if (pass) {
      return {
        message: () => `expected [${received}] array elements are unique`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected [${received}] array elements are not unique`,
        pass: false,
      };
    }
  },
});
