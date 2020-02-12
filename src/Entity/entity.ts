import { Vector2 } from '../util'
import * as PIXI from 'pixi.js'
import Art from '../art'

export default class Entity {
  protected position: Vector2 = new Vector2(0, 0)
  protected velocity: Vector2 = new Vector2(0, 0)
  protected accel: Vector2 = new Vector2(0, 0)
  public sprite: PIXI.Graphics
  constructor(position: Vector2) {
    this.position = position
    this.sprite = Art.createRect(0xf03060)
  }
  update(): void {
    this.sprite.position.x = this.position.x
    this.sprite.position.y = this.position.y
  }
}
