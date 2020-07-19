import { Entity } from '../../ecs/entity'
import { BehaviourNode, NodeState } from '../behaviourNode'
import { Vec2 } from '../../math/vec2'
import * as PIXI from 'pixi.js'
import { AABBCollider, Collider } from '../../components/colliderComponent'
import { PositionComponent } from '../../components/positionComponent'

export class BalloonVineChaseNode implements BehaviourNode {
  private v = new Vec2(0, 0)
  private himo?: PIXI.SimpleRope
  private points: Array<PIXI.Point> = []
  private walls?: Array<Entity>
  private targetWall?: PositionComponent

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

    const [gripAABB, _, rootAABB, wallAABB] = entity.getComponent('Collider').colliders as Array<
      AABBCollider
    >

    if (!this.walls) {
      this.walls = []
      wallAABB.callbacks.add((me: Collider, other: Collider) => {
        this.walls?.push(other.component.entity)
      })
    }
    const findAppropriateWall = (): PositionComponent | undefined => {
      if (this.walls?.length === 0) return
      return this.walls
        ?.map(wall => {
          const p = wall.getComponent('Position').add(new Vec2(4, 4))
          const v = p.sub(wallAABB.bound.center)
          return { p, value: v.div(v.lengthSq()).dot(new Vec2(0, 1)) }
        })
        .filter(w => w.value > 0)
        .reduce((a, b) => (a.value > b.value ? a : b))?.p
    }
    if (pickup.isPossessed) this.targetWall = undefined
    else if (!this.targetWall) {
      this.targetWall = findAppropriateWall()
    }
    this.walls = []
    const target = pickup.isPossessed ? player.getComponent('Position') : this.targetWall

    if (target) {
      const po = target
      const pp = po.sub(new Vec2(-10, 30))
      const p = entity.getComponent('Position')
      const r = p.sub(pp)
      const l = r.length()
      const nr = r.normalize()
      const vr = this.v.dot(nr)

      const l0 = 2
      const k = 0.02
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
    }
    gripAABB.bound.position.x = this.points.map(p => p.x).reduce((a, b) => Math.min(a, b))
    gripAABB.bound.position.y = this.points.map(p => p.y).reduce((a, b) => Math.min(a, b))
    gripAABB.bound.size.x =
      this.points.map(p => p.x).reduce((a, b) => Math.max(a, b)) - gripAABB.bound.position.x + 1
    gripAABB.bound.size.y =
      this.points.map(p => p.y).reduce((a, b) => Math.max(a, b)) - gripAABB.bound.position.y

    const lp = this.points[this.points.length - 1]
    rootAABB.bound.position.x = lp.x - rootAABB.bound.size.x / 2
    rootAABB.bound.position.y = lp.y - rootAABB.bound.size.y

    wallAABB.bound.position.x = lp.x - wallAABB.bound.size.x / 2
    wallAABB.bound.position.y = lp.y

    const rigidBody = entity.getComponent('RigidBody')

    if (!pickup.isPossessed && !this.targetWall) {
      rigidBody.gravityScale = 0.5
      if (rigidBody.velocity.length() > 400) {
        rigidBody.velocity = rigidBody.velocity.mul(400 / rigidBody.velocity.length())
      }
    } else {
      rigidBody.gravityScale = 0
      rigidBody.velocity = new Vec2(0, 0)
    }

    return NodeState.Running
  }
}
