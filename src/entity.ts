import * as PIXI from 'pixi.js'
import { Vector2 } from './util'

export default class Entity {
  protected position: Vector2 = new Vector2(0, 0)
  protected velocity: Vector2 = new Vector2(0, 0)
  protected accel: Vector2 = new Vector2(0, 0)
  public sprite: PIXI.Graphics
  constructor(position: Vector2) {
    this.position = position
    this.sprite = new PIXI.Graphics()
    this.sprite.beginFill(0xf03060)
    this.sprite.drawRect(0, 0, 32, 32)
    this.sprite.endFill()
  }
  update(): void {
    this.sprite.position.x = this.position.x
    this.sprite.position.y = this.position.y
  }
}
