import { System } from '@core/ecs/system'
import { Entity } from '@core/ecs/entity'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { Collider, CollisionCallbackArgs } from '@game/components/colliderComponent'
import { collide, WithHit } from '@core/collision/collision'
import { AABB } from '@core/collision/geometry/AABB'
import { OBB } from '@core/collision/geometry/OBB'
import { CollisionResultOBBOBB } from '@core/collision/collision/OBB_OBB'

export default class PhysicsSystem extends System {
  private family: Family

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('Position', 'Collider', 'RigidBody').build()
    this.family.entityAddedEvent.addObserver((entity: Entity) => {
      for (const c of entity.getComponent('Collider').colliders) {
        c.callbacks.add((args: CollisionCallbackArgs) => {
          const { me, other } = args
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
    const { entity: entity1, geometry: g1 } = c1
    const { entity: entity2, geometry: g2 } = c2
    if (!entity1.hasComponent('RigidBody')) return
    if (!entity2.hasComponent('RigidBody')) return

    const body1 = entity1.getComponent('RigidBody')
    const body2 = entity2.getComponent('RigidBody')

    const position1 = entity1.getComponent('Position')
    const position2 = entity2.getComponent('Position')

    if (!(g1 instanceof AABB) && !(g1 instanceof OBB)) return
    if (!(g2 instanceof AABB) && !(g2 instanceof OBB)) return

    let obb1 = g1 instanceof AABB ? g1.asOBB() : g1
    let obb2 = g2 instanceof AABB ? g2.asOBB() : g2

    // TODO:別クラスに分ける
    obb1 = obb1.applyPosition(position1)
    obb2 = obb2.applyPosition(position2)

    const center1 = obb1.bound.center
    const center2 = obb2.bound.center

    const pDiff = center1.sub(center2)
    const vDiff = body1.velocity.sub(body2.velocity)

    const obbResult = collide(c1, c2, position1, position2) as WithHit<CollisionResultOBBOBB>

    // これまでのsolveですでに衝突が解消されている可能性がある
    if (!obbResult.hit) {
      return
    }

    const { clip, axis } = obbResult

    if (clip < 0) {
      // すでに衝突は解消されている
      return
    }

    const sumMass = body1.invMass + body2.invMass
    if (sumMass === 0) return
    // 反発係数
    const rest = 1 + body1.restitution * body2.restitution

    // 離れようとしているときに押し出さないようにする
    if (vDiff.dot(axis) * pDiff.dot(axis) <= 0) {
      const dv = (vDiff.dot(axis) / sumMass) * rest
      body1.velocity.assign(body1.velocity.add(axis.mul(-dv * body1.invMass)))
      body2.velocity.assign(body2.velocity.add(axis.mul(+dv * body2.invMass)))
    }

    // 押し出し
    position1.assign(position1.add(axis.mul((-clip * body1.invMass) / sumMass)))
    position2.assign(position2.add(axis.mul((+clip * body2.invMass) / sumMass)))
  }
}
