// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const assert: (condition: unknown) => asserts condition = condition => {
  if (!condition) {
    throw new Error(`Assertion failed. Condition: ${condition}`)
  }
}
// export const assert = (
//   condition: unknown,
//   msg = 'Assertion failed'
// ): asserts condition => {
//   if (!condition) {
//     throw new Error(`AssertionError. ${msg}`)
//   }
// }
