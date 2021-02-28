import { windowSize } from '@core/application'
import { Behaviour } from '@core/behaviour/behaviour'
import { parallelAll } from '@core/behaviour/composite'
import { CollisionResultRayAABB } from '@core/collision/collision/Ray_AABB'
import { Ray } from '@core/collision/geometry/ray'
import { Entity } from '@core/ecs/entity'
import { FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { CollisionCallbackArgs } from '@game/components/colliderComponent'
import { MouseController } from '@game/systems/controlSystem'
import { Graphics } from 'pixi.js'

const getClosestHitPointGenerator = function*(entity: Entity): Generator<Vec2, void> {
  const [collider] = entity.getComponent('Collider').colliders
  const ray = collider.geometry as Ray

  let hitPoints: Array<Vec2> = []
  collider.callbacks.add((args: CollisionCallbackArgs) => {
    const { hitPoint } = args as CollisionResultRayAABB
    hitPoints.push(hitPoint)
  })

  while (true) {
    const closestHitPoint = hitPoints.reduce(
      (a, b) => (a.sub(ray.origin).length() < b.sub(ray.origin).length() ? a : b),
      ray.origin.add(ray.direction.mul(114514))
    )
    hitPoints = []
    yield closestHitPoint
  }
}

const updateDraw = function*(entity: Entity): Behaviour<void> {
  const getClosestHitPoint = getClosestHitPointGenerator(entity)
  const [g] = entity.getComponent('Draw').children as [Graphics]
  const [collider] = entity.getComponent('Collider').colliders
  const ray = collider.geometry as Ray

  for (const closestHitPoint of getClosestHitPoint) {
    g.clear()
    g.lineStyle(0.5, 0xff0000)
    g.moveTo(ray.origin.x, ray.origin.y)
    g.lineTo(closestHitPoint.x, closestHitPoint.y)
    g.beginFill(0xff0000)
    g.drawCircle(closestHitPoint.x, closestHitPoint.y, 2)
    yield
  }
}

const updateRay = function*(entity: Entity, world: World): Behaviour<void> {
  const playerFamily = new FamilyBuilder(world).include('Player').build()
  const [collider] = entity.getComponent('Collider').colliders
  while (true) {
    const [player] = playerFamily.entityArray
    const mousePosition = MouseController.position
    const ray = collider.geometry as Ray
    const position = player.getComponent('Position')

    ray.origin = position
    ray.direction = mousePosition.sub(new Vec2(windowSize.width / 2, windowSize.height / 2))
    yield
  }
}

export const laserSightAI = (entity: Entity, world: World): Behaviour<void> =>
  parallelAll([updateDraw(entity), updateRay(entity, world)])