import { Behaviour } from '@core/behaviour/behaviour'
import { OBB } from '@core/collision/geometry/obb'
import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { Graphics, Sprite } from 'pixi.js'

class Stem {
  public g = new Graphics()
  private angle = 0.02
  private omega = 0
  private dt = 1 / 60
  private m = 1

  constructor(public l: number, private w: number, private k: number, private c: number) {}

  draw(): void {
    const { g, l, w } = this
    g.clear()
    g.lineStyle(w, 0x00ff00)

    g.moveTo(0, 0)

    const N = 100
    for (let i = 0; i < N; i++) {
      const t = (i / N) * l
      const p = this.pos(t)
      g.lineTo(p.x, p.y)
    }
  }

  step(): void {
    const { angle, omega, k, c, m, w, dt } = this
    const tan = Math.tan(angle)
    this.omega = (omega * m * w - 6 * k * dt * tan) / (m * w + 6 * c * dt * (1 + tan * tan))
    this.angle += this.omega * dt
  }

  updateSprite(sprite: Sprite): void {
    const p = this.pos(this.l)
    sprite.position.set(p.x, p.y)
    sprite.angle = (-this.angle * this.l * 180) / Math.PI
  }

  updateOBB(obb: OBB): void {
    obb.angle = this.angle * this.l
    obb.bound.center = this.pos(this.l)
  }

  pos(t: number): Vec2 {
    const { angle } = this
    if (angle === 0) return new Vec2(0, t)
    return new Vec2((Math.cos(angle * t) - 1) / angle, -Math.sin(angle * t) / angle)
  }
}

export const flowerAI = function*(entity: Entity): Behaviour<void> {
  const draw = entity.getComponent('Draw')
  const [collider] = entity.getComponent('Collider').colliders

  const [sprite] = draw.children as [Sprite]

  const stem = new Stem(50, 5, 30, 0.8)
  draw.addChild(stem.g)
  while (true) {
    stem.step()
    stem.draw()
    stem.updateSprite(sprite)
    stem.updateOBB(collider.geometry as OBB)
    yield
  }
}
