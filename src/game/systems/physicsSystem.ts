import { System } from '@core/ecs/system'
import { Entity } from '@core/ecs/entity'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { AABBForCollision, Collider } from '@game/components/colliderComponent'

export default class PhysicsSystem extends System {
  private family: Family

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('Position', 'Collider', 'RigidBody').build()
    this.family.entityAddedEvent.addObserver((entity: Entity) => {
      for (const c of entity.getComponent('Collider').colliders) {
        c.callbacks.add((me: Collider, other: Collider) => {
          this.solve(me, other)
        })
      }
    })
  }

  public update(delta: number): void {
    for (const entity of this.family.entityIterator) {
      const position = entity.getComponent('Position')
      const body = entity.getComponent('RigidBody')
      body.velocity.x += body.acceleration.x * delta
      body.velocity.y += body.acceleration.y * delta
      position.x += body.velocity.x * delta
      position.y += body.velocity.y * delta
      body.acceleration.x = body.acceleration.y = 0
    }
  }

  // 互いに押し合う
  private solve(c1: Collider, c2: Collider): void {
    if (c1.isSensor) return
    if (c2.isSensor) return
    if (!c1.entity.hasComponent('RigidBody')) return
    if (!c2.entity.hasComponent('RigidBody')) return

    const body1 = c1.entity.getComponent('RigidBody')
    const body2 = c2.entity.getComponent('RigidBody')

    const position1 = c1.entity.getComponent('Position')
    const position2 = c2.entity.getComponent('Position')
    // TODO:別クラスに分ける
    if (c1.geometry instanceof AABBForCollision && c2.geometry instanceof AABBForCollision) {
      const aabb1 = c1.geometry.bound.add(position1)
      const aabb2 = c2.geometry.bound.add(position2)

      const center1 = aabb1.center
      const center2 = aabb2.center

      const pDiff = center1.sub(center2)
      const vDiff = body1.velocity.sub(body2.velocity)

      const clip = aabb1.size
        .add(aabb2.size)
        .div(2)
        .sub(pDiff.abs())

      if (clip.x < 0 || clip.y < 0) {
        // すでに衝突は解消されている
        return
      }

      const sumMass = body1.invMass + body2.invMass
      if (sumMass === 0) return
      // 反発係数
      const rest = 1 + body1.restitution * body2.restitution
      // 埋まってる距離が短い方向に押し出す
      if (Math.abs(clip.x) > Math.abs(clip.y)) {
        // 縦方向
        // 離れようとしているときに押し出さないようにする
        if (vDiff.y * pDiff.y <= 0) {
          body1.velocity.y += -vDiff.y * (body1.invMass / sumMass) * rest
          body2.velocity.y += vDiff.y * (body2.invMass / sumMass) * rest
        }
        // 押し出し
        let sign = 1
        if (pDiff.y > 0) sign = -1
        position1.y += sign * -clip.y * (body1.invMass / sumMass)
        position2.y += sign * clip.y * (body2.invMass / sumMass)
      } else {
        // 横方向
        // 離れようとしているときに押し出さないようにする
        if (vDiff.x * pDiff.x <= 0) {
          body1.velocity.x += -vDiff.x * (body1.invMass / sumMass) * rest
          body2.velocity.x += vDiff.x * (body2.invMass / sumMass) * rest
        }
        // 押し出し
        let sign = 1
        if (pDiff.x > 0) sign = -1
        position1.x += sign * -clip.x * (body1.invMass / sumMass)
        position2.x += sign * clip.x * (body2.invMass / sumMass)
      }
    }
  }
}
