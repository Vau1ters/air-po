export class ReservedArray<T> {
  private arr: Array<T>
  private len: number

  public constructor(cap: number) {
    this.arr = new Array<T>(cap)
    this.len = 0
  }

  public at(idx: number): T {
    return this.arr[idx]
  }

  public get length(): number {
    return this.len
  }

  public push(e: T): void {
    this.arr[this.len++] = e
    if (this.len === this.arr.length) {
      this.arr = this.arr.concat(this.arr)
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
