import * as PIXI from 'pixi.js'
import { Vector2 } from './util'

export default class Entity {
  private position: Vector2 = new Vector2(0, 0)
  private velocity: Vector2 = new Vector2(0, 0)
  private accel: Vector2 = new Vector2(0, 0)
  public sprite: PIXI.Graphics
  constructor(position: Vector2) {
    this.position = position
    this.sprite = new PIXI.Graphics()
    this.sprite.beginFill(0xf03060)
    this.sprite.drawRect(0, 0, 32, 32)
    this.sprite.endFill()
  }

  // 単振動するだけ
  phys(): void {
    const dt = 0.1
    const k = new Vector2(0.03, 0.02)
    const l = new Vector2(this.position.x - 400, this.position.y - 300)
    this.accel.x = -k.x * l.x
    this.accel.y = -k.y * l.y
    this.velocity.x += this.accel.x * dt
    this.velocity.y += this.accel.y * dt
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
  update(): void {
    this.phys()
    this.sprite.position.x = this.position.x
    this.sprite.position.y = this.position.y
  }
}
