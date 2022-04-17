import { windowSize } from '@core/application'
import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { MouseController } from '@game/systems/controlSystem'
import { getSingleton } from '@game/systems/singletonSystem'
import { AIR_NADE_LIFE, AIR_NADE_VELOCITY, calcAirNadeThrowDirection } from '../airNade/airNadeAI'
import GravitySystem from '@game/systems/gravitySystem'
import { Graphics } from 'pixi.js'
import { entitySetting } from '@game/entities/loader/entitySetting.autogen'
import { searchBySegment } from '../common/action/segmentSearch'
import { CategorySet } from '@game/entities/category'
import { parallelAll } from '@core/behaviour/composite'

export const airNadeLaserSightAI = function* (laser: Entity, world: World): Behaviour<void> {
  const player = getSingleton('Player', world)
  const camera = getSingleton('Camera', world)
  const [g] = laser.getComponent('Draw').children as [Graphics]
  const delta = 1 / 60

  while (true) {
    const mousePosition = MouseController.position
    const playerPos = player.getComponent('Position')
    const cameraPosition = camera.getComponent('Position')
    const mousePositionOnScreen = mousePosition.sub(
      new Vec2(windowSize.width / 2, windowSize.height / 2)
    )
    const mousePositionOnWorld = cameraPosition.add(mousePositionOnScreen)
    const vel = calcAirNadeThrowDirection(mousePositionOnWorld, playerPos).mul(AIR_NADE_VELOCITY)
    player.getComponent('Player').targetPosition = mousePositionOnWorld

    const pos = playerPos.copy()

    const search = []
    for (let i = 0; i < AIR_NADE_LIFE; i++) {
      vel.y += GravitySystem.acceleration * delta * entitySetting.airNade.rigidBody.gravityScale
      const nextPos = pos.add(vel.mul(delta))
      search.push(
        searchBySegment({
          start: pos.copy(),
          end: nextPos,
          mask: new CategorySet('terrain'),
          world,
        })
      )
      pos.assign(nextPos)
    }
    const searchResults = yield* parallelAll(search)

    g.clear()
    g.lineStyle(1, 0xff0000, undefined, undefined, true)
    g.moveTo(playerPos.x, playerPos.y)
    for (const result of searchResults) {
      if (result.entity === undefined) {
        g.lineTo(result.point.x, result.point.y)
      } else {
        g.beginFill(0xff0000)
        g.drawCircle(result.point.x, result.point.y, 2)
        break
      }
    }
  }
}
