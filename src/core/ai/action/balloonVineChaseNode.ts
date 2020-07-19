import { Entity } from '../../ecs/entity'
import { BehaviourNode, NodeState } from '../behaviourNode'
import { Vec2 } from '../../math/vec2'
import * as PIXI from 'pixi.js'
import { AABBCollider } from '../../components/colliderComponent'

export class BalloonVineChaseNode implements BehaviourNode {
  private v = new Vec2(0, 0)
  private himo?: PIXI.SimpleRope
  private points: Array<PIXI.Point> = []

  public initState(): void {
    // empty
  }

  public execute(entity: Entity): NodeState {
    const player = entity.getComponent('PlayerPointer').getPlayer()
    if (!player) return NodeState.Failure
    const draw = entity.getComponent('Draw')
    const pickup = entity.getComponent('PickupTarget')

    if (!this.himo) {
      this.points = new Array<PIXI.Point>(10)
      for (let i = 0; i < this.points.length; i++) this.points[i] = new PIXI.Point(0, i * 2)
      this.himo = new PIXI.SimpleRope(PIXI.Texture.WHITE, this.points, 0.1)
      this.himo.tint = 0x22ff22
      draw.addChild(this.himo)
    }

    if (pickup.isPossessed) {
      const po = player.getComponent('Position')
      const pp = po.add(new Vec2(0, -20))
      const p = entity.getComponent('Position')
      const r = p.sub(pp)
      const l = r.length()
      const nr = r.normalize()
      const vr = this.v.dot(nr)

      const l0 = 2
      const k = 0.01
      const c = 0.1
      const d = 0.1
      const ml = 10

      const ar = -k * (l - l0) - c * vr

      this.v = this.v.add(nr.mul(ar))
      this.v = this.v.mul(1 - d)

      let np = p.add(this.v)
      const nl = np.sub(pp).length()
      if (nl > ml) {
        np = pp.add(np.sub(pp).mul(ml / nl))
      }
      this.v = np.sub(p)

      p.x += this.v.x
      p.y += this.v.y

      const dx = p.x - po.x
      const dy = p.y - po.y
      const a = dy / Math.sqrt(Math.abs(dx))
      for (let i = 0; i < this.points.length; i++) {
        const x = (i / this.points.length) * dx
        const y = a * Math.sqrt(Math.abs(x))
        this.points[i].x = -x
        this.points[i].y = -y
      }

      const aabb = entity.getComponent('Collider').colliders[0] as AABBCollider
      aabb.bound.position.x = this.points.map(p => p.x).reduce((a, b) => Math.min(a, b))
      aabb.bound.position.y = this.points.map(p => p.y).reduce((a, b) => Math.min(a, b))
      aabb.bound.size.x =
        this.points.map(p => p.x).reduce((a, b) => Math.max(a, b)) - aabb.bound.position.x
      aabb.bound.size.y =
        this.points.map(p => p.y).reduce((a, b) => Math.max(a, b)) - aabb.bound.position.y
    }
    return NodeState.Running
  }
}
