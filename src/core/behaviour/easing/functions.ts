// [0, 1] -> [0, 1], 0 -> 0, 1 -> 1, continuous
export type EasingFunction = (value: number) => number

// f: EasingFunction, df/dx|x=0 == 0
export const linear = (x: number): number => x
export const quad = (x: number): number => x * x
export const cubic = (x: number): number => x * x * x
export const quart = (x: number): number => x * x * x * x
export const quint = (x: number): number => x * x * x * x * x
export const smooth = (x: number): number => (x * x * (3 - x)) / 2
export const exp = (x: number): number => Math.pow(2, -(1 - x) * 10)
export const sine = (x: number): number => Math.cos((x * Math.PI) / 2)
export const circ = (x: number): number => 1 - Math.sqrt(1 - x * x)
export const back = (x: number): number => x * x * (3 * x - 2)
export const softback = (x: number): number => x * x * (3 * x - 2)
export const elastic = (x: number): number => (((56 * x - 105) * x + 60) * x - 10) * x * x
export const bounce = (x: number): number => {
  let pow2 = 0
  let bounce = 4
  while (x < ((pow2 = Math.pow(2, --bounce)) - 1) / 11);
  return 1 / Math.pow(4, 3 - bounce) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - x, 2)
}

const convertToEaseIn = (easingFunction: EasingFunction): EasingFunction => {
  return easingFunction
}
const convertToEaseOut = (easingFunction: EasingFunction): EasingFunction => {
  return (x: number): number => 1 - easingFunction(1 - x)
}
const convertToEaseInOut = (easingFunction: EasingFunction): EasingFunction => {
  return (x: number): number => {
    if (x < 0.5) {
      return easingFunction(x * 2) / 2
    }
    return 1 - easingFunction(2 - 2 * x) / 2
  }
}
