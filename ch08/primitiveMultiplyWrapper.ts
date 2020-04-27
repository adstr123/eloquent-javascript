class MultiplicatorUnitFailure extends Error {}

function primitiveMultiply(a: number, b: number): number {
  if (Math.random() < 0.2) {
    return a * b;
  } else {
    throw new MultiplicatorUnitFailure("Klunk");
  }
}

export default function primitiveMultiplyWrapper(a: number, b: number): number | undefined {
  for (;;) {
    try {
      return primitiveMultiply(a, b);
    } catch (e) {
      if (!(e instanceof MultiplicatorUnitFailure))
        throw e;
    }
  }
}