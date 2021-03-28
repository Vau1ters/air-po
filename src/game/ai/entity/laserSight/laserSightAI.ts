import { windowSize } from '@core/application'
import { Behaviour } from '@core/behaviour/behaviour'
import { parallelAll } from '@core/behaviour/composite'
import { CollisionResultRayAABB } from '@core/collision/collision/Ray_AABB'
import { Ray } from '@core/collision/geometry/ray'
import { Entity } from '@core/ecs/entity'
import { FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { INFINITY_COORDINATE } from '@core/math/constants'
import { Vec2 } from '@core/math/vec2'
import { CollisionCallbackArgs } from '@game/components/colliderComponent'
import { MouseController } from '@game/systems/controlSystem'
import { Graphics } from 'pixi.js'

const getClosestHitPointGenerator = function*(
  player: Entity,
  laser: Entity
): Generator<Vec2, void> {
  const [collider] = laser.getComponent('Collider').colliders
  const ray = collider.geometry as Ray

  let hitPoints: Array<Vec2> = []
  collider.callbacks.add((args: CollisionCallbackArgs) => {
    const { other } = args
    const { hitPoint } = args as CollisionResultRayAABB
    if (other.entity === player) return
    hitPoints.push(hitPoint)
  })

  while (true) {
    const closestHitPoint = hitPoints.reduce(
      (a, b) => (a.sub(ray.origin).length() < b.sub(ray.origin).length() ? a : b),
      ray.origin.add(ray.direction.mul(INFINITY_COORDINATE))
    )
    hitPoints = []
    yield closestHitPoint
  }
}

const updateDraw = function*(player: Entity, laser: Entity): Behaviour<void> {
  const getClosestHitPoint = getClosestHitPointGenerator(player, laser)
  const [g] = laser.getComponent('Draw').children as [Graphics]
  const [collider] = laser.getComponent('Collider').colliders
  const ray = collider.geometry as Ray

  for (const closestHitPoint of getClosestHitPoint) {
    g.clear()
    g.lineStyle(1, 0xff0000)
    g.moveTo(ray.origin.x, ray.origin.y)
    g.lineTo(closestHitPoint.x, closestHitPoint.y)
    g.beginFill(0xff0000)
    g.drawCircle(closestHitPoint.x, closestHitPoint.y, 2)
    yield
  }
}

const updateRay = function*(laser: Entity, world: World): Behaviour<void> {
  const playerFamily = new FamilyBuilder(world).include('Player').build()
  const [collider] = laser.getComponent('Collider').colliders
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

export const laserSightAI = (player: Entity, laser: Entity, world: World): Behaviour<void> =>
  parallelAll([updateDraw(player, laser), updateRay(laser, world)])
