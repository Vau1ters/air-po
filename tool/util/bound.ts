export class Bound {
  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly width: number,
    public readonly height: number
  ) {}

  static fromCorner<Corner extends { x: number; y: number }>(start: Corner, end: Corner): Bound {
    return new Bound(start.x, start.y, end.x - start.x + 1, end.y - start.y + 1)
  }

  get area(): number {
    return this.width * this.height
  }
}
