export class Vector2 {
  public x: number
  public y: number

  constructor(x: number, y: number | undefined) {
    // Vector2(x,y) => (x,y)
    // Vector2(x)    => (x,x)
    this.x = x
    this.y = y !== undefined ? y : x
  }
}
