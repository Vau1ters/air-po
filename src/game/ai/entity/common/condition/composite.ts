export const not = (cond: () => boolean): (() => boolean) => (): boolean => !cond()
