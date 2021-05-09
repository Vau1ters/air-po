import { Entity } from '@core/ecs/entity'
import { FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { Behaviour } from '@core/behaviour/behaviour'
import { Vec2 } from '@core/math/vec2'
import * as PIXI from 'pixi.js'
import { PositionComponent } from '@game/components/positionComponent'
import { CollisionCallbackArgs } from '@game/components/colliderComponent'
import { AABB } from '@core/collision/geometry/AABB'

export const balloonVineBehaviour = function*(entity: Entity, world: World): Behaviour<void> {
  const player = new FamilyBuilder(world).include('Player').build().entityArray[0]
  const draw = entity.getComponent('Draw')
  const pickup = entity.getComponent('PickupTarget')

  const points = new Array<PIXI.Point>(10)
  for (let i = 0; i < points.length; i++) points[i] = new PIXI.Point(0, i * 2)
  const rope = new PIXI.SimpleRope(PIXI.Texture.WHITE, points, 0.1)
  rope.tint = 0x22ff22
  draw.addChild(rope)

  const [gripCollider, _, __, rootCollider, wallDetectionCollider] = entity.getComponent(
    'Collider'
  ).colliders
  const gripAABB = gripCollider.geometry as AABB
  const rootAABB = rootCollider.geometry as AABB
  const wallDetectionAABB = wallDetectionCollider.geometry as AABB

  const targetWall = ((): { update: () => void; get: () => PositionComponent | undefined } => {
    let walls: Array<Entity> = []
    let targetWall: PositionComponent | undefined = undefined

    wallDetectionCollider.callbacks.add((args: CollisionCallbackArgs) => {
      walls.push(args.other.entity)
    })

    const findAppropriateWall = (): PositionComponent | undefined => {
      if (walls.length === 0) return
      return walls
        .map(wall => {
          const p = wall.getComponent('Position')
          const v = p.sub(wallDetectionAABB.center)
          return { p, value: v.div(v.lengthSq()).dot(new Vec2(0, 1)) }
        })
        .filter(w => w.value > 0)
        .reduce((a, b) => (a.value > b.value ? a : b))?.p
    }

    return {
      update: (): void => {
        if (pickup.isPossessed) targetWall = undefined
        else if (!targetWall) targetWall = findAppropriateWall()
        walls = []
      },
      get: (): PositionComponent | undefined => targetWall,
    }
  })()

  while (true) {
    targetWall.update()
    const target = pickup.isPossessed ? player.getComponent('Position') : targetWall.get()

    if (target) {
      const po = target
      const pp = po.sub(new Vec2(-10, 30))
      const p = entity.getComponent('Position')
      const r = p.sub(pp)
      const l = r.length()
      const nr = r.normalize()

      const l0 = 2
      const k = 0.02
      const d = 0.1
      const ml = 10

      const ar = -k * (l - l0)

      let v = nr.mul(ar)
      v = v.mul(1 - d)

      let np = p.add(v)
      const nl = np.sub(pp).length()
      if (nl > ml) {
        np = pp.add(np.sub(pp).mul(ml / nl))
      }
      v = np.sub(p)

      p.x += v.x
      p.y += v.y

      const dx = p.x - po.x
      const dy = p.y - po.y
      const a = dy / Math.sqrt(Math.abs(dx))
      for (let i = 0; i < points.length; i++) {
        const x = (i / points.length) * dx
        const y = dx === 0 ? (dy * i) / points.length : a * Math.sqrt(Math.abs(x))
        points[i].x = -x
        points[i].y = -y
      }
    }
    gripAABB.assign(AABB.fromPoints(points.map(p => new Vec2(p.x, p.y))))

    const lp = points[points.length - 1]
    rootAABB.center.x = lp.x
    rootAABB.center.y = lp.y - rootAABB.size.y / 2

    wallDetectionAABB.center.x = lp.x
    wallDetectionAABB.center.y = lp.y

    const rigidBody = entity.getComponent('RigidBody')

    if (!pickup.isPossessed && !targetWall.get()) {
      rigidBody.gravityScale = 0.5
      if (rigidBody.velocity.length() > 400) {
        rigidBody.velocity = rigidBody.velocity.mul(400 / rigidBody.velocity.length())
      }
    } else {
      rigidBody.gravityScale = 0
      rigidBody.velocity = new Vec2(0, 0)
    }

    yield
  }
}
