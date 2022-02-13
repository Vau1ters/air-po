import { dependsOn, System } from '@core/ecs/system'
import { Entity } from '@core/ecs/entity'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { Collider, CollisionCallbackArgs } from '@game/components/colliderComponent'
import { collide, WithHit } from '@core/collision/collision'
import { assert } from '@utils/assertion'
import { Vec2 } from '@core/math/vec2'

interface SolvableCollisionResult {
  clip: number
  axis: Vec2
}

export const PHYSICS_TAG = 'physics'

export default class PhysicsSystem extends System {
  private family: Family

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('Position', 'Collider', 'RigidBody').build()
    this.family.entityAddedEvent.addObserver((entity: Entity) => {
      for (const c of entity.getComponent('Collider').colliders) {
        if (c.tag.has(PHYSICS_TAG)) {
          switch (c.category) {
            case 'physics':
              assert(
                c.mask.has('physics') || c.mask.has('terrain'),
                `Collider with '${PHYSICS_TAG}' tag and PHYSICS category must have PHYSICS or TERRAIN mask`
              )
              c.notifier.addObserver((args: CollisionCallbackArgs) => {
                const { me, other } = args
                this.solve(me, other)
              })
              break
            case 'terrain':
              assert(
                c.mask.has('physics'),
                `Collider with '${PHYSICS_TAG}' tag and TERRAIN category must have PHYSICS mask`
              )
              c.notifier.addObserver((args: CollisionCallbackArgs) => {
                const { me, other } = args
                this.solve(me, other)
              })
              break
            default:
              assert(
                false,
                `Collider with '${PHYSICS_TAG}' tag must have PHYSICS or TERRAIN category`
              )
          }
        }
      }
    })
  }

  @dependsOn({
    after: ['GravitySystem:update'],
  })
  public update(delta: number): void {
    for (const entity of this.family.entityIterator) {
      const position = entity.getComponent('Position')
      const body = entity.getComponent('RigidBody')
      body.acceleration.x -= body.airResistance * body.velocity.x
      body.acceleration.y -= body.airResistance * body.velocity.y
      body.velocity.x += body.acceleration.x * delta
      body.velocity.y += body.acceleration.y * delta
      position.x += body.velocity.x * delta
      position.y += body.velocity.y * delta
      body.acceleration.x = body.acceleration.y = 0
    }
  }

  // 互いに押し合う
  private solve(c1: Collider, c2: Collider): void {
    const { entity: entity1, geometry: g1 } = c1
    const { entity: entity2, geometry: g2 } = c2
    if (!entity1.hasComponent('RigidBody')) return
    if (!entity2.hasComponent('RigidBody')) return

    const body1 = entity1.getComponent('RigidBody')
    const body2 = entity2.getComponent('RigidBody')

    const position1 = entity1.getComponent('Position')
    const position2 = entity2.getComponent('Position')

    if (!g1.solvable()) return
    if (!g2.solvable()) return

    const vDiff = body1.velocity.sub(body2.velocity)

    const collisionResult = collide(
      c1,
      c2,
      position1,
      position2
    ) as WithHit<SolvableCollisionResult>

    // これまでのsolveですでに衝突が解消されている可能性がある
    if (!collisionResult.hit) {
      return
    }

    let { clip, axis } = collisionResult

    const solveDirs = c1.solveDir.concat(c2.solveDir.map(d => d.mul(-1)))

    if (solveDirs.length > 0) {
      const newAxis = solveDirs.reduce((a, b) => (axis.dot(a) > axis.dot(b) ? a : b))
      // 指定された解決方向に解決できそうにない場合は何もしない
      if (axis.dot(newAxis) <= 0) return
      axis = newAxis
      clip /= newAxis.dot(axis.normalize())
    }

    if (clip < 0) {
      // すでに衝突は解消されている
      return
    }

    const sumMass = body1.invMass + body2.invMass
    if (sumMass === 0) return
    // 反発係数
    const rest = 1 + body1.restitution * body2.restitution

    // 離れようとしているときに押し出さないようにする
    if (vDiff.dot(axis) >= 0) {
      const dv = (vDiff.dot(axis) / sumMass) * rest
      body1.velocity.assign(body1.velocity.add(axis.mul(-dv * body1.invMass)))
      body2.velocity.assign(body2.velocity.add(axis.mul(+dv * body2.invMass)))
    }

    // 押し出し
    position1.assign(position1.add(axis.mul((-clip * body1.invMass) / sumMass)))
    position2.assign(position2.add(axis.mul((+clip * body2.invMass) / sumMass)))
  }
}
