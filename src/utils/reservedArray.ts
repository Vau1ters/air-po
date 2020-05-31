export class ReservedArray<T> {
  private a: Array<T>
  private len: number

  public constructor(cap: number) {
    this.a = new Array<T>(cap)
    this.len = 0
  }

  public at(idx: number): T {
    return this.a[idx]
  }

  public get length(): number {
    return this.len
  }

  public push(e: T): void {
    this.a[this.len++] = e
    if (this.len === this.a.length) {
      this.a = this.a.concat(this.a)
    }
  }

  public toArray(): T[] {
    const result = new Array<T>(this.length)
    for (let i = 0; i < this.length; i++) {
      result[i] = this.at(i)
    }
    return result
  }
}
