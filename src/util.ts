/*the second argument can be omitted
    As follows : 
    vec2(x,y) = (x,y)
    vec2 (x) = (x,x)
*/
export class Vector2 {
  public x: number
  public y: number

  constructor(x: number, y: number | undefined) {
    this.x = x
    this.y = y !== undefined ? y : x
  }
}
