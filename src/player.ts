import Entity from './entity'
import { Vector2 } from './util'

export default class Player extends Entity {
  constructor(position: Vector2) {
    super(position)
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
  update() {
    this.phys()
    this.sprite.position.x = this.position.x
    this.sprite.position.y = this.position.y
  }
}
