import * as PIXI from 'pixi.js'

export default class Entity {
  private x = 0
  private y = 300
  public sprite: PIXI.Graphics
  constructor() {
    this.sprite = new PIXI.Graphics()
    this.sprite.beginFill(0xf03060)
    this.sprite.drawRect(this.x, this.y, 32, 32)
    this.sprite.endFill()
  }
  update(): void {
    this.x++
    this.sprite.position.x = this.x
  }
}
