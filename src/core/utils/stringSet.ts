export class StringSet {
  private strSet: Set<string>
  public constructor(strs: string | string[] | undefined) {
    if (typeof strs === 'string') {
      this.strSet = new Set([strs])
    } else if (strs === undefined) {
      this.strSet = new Set()
    } else {
      this.strSet = new Set(strs)
    }
  }

  public has(str: string): boolean {
    return this.strSet.has(str)
  }
}
