import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { DrawComponent } from '@game/components/drawComponent'
import { MouseController } from '@game/systems/controlSystem'
import { PositionComponent } from '@game/components/positionComponent'
import { CameraComponent } from '@game/components/cameraComponent'
import { parallelAny } from '@core/behaviour/composite'
import { FadeOut } from '../common/animation/fadeOut'
import { createSprite } from '@core/graphics/art'
import { OpeningWorldFactory } from '@game/flow/opening/openingWorldFactory'
import { Flow } from '../flow'
import { gameFlow } from '../game/gameFlow'
import { loadData, saveData, StoryStatus } from '@game/playdata/playdata'

const camera = function*(world: World): Behaviour<void> {
  const camera = new Entity()
  camera.addComponent('Position', new PositionComponent())
  camera.addComponent('Camera', new CameraComponent([]))
  world.addEntity(camera)

  while (true) {
    camera.getComponent('Position').y += 0.1
    yield
  }
}

const player = function*(world: World): Behaviour<void> {
  const player = new Entity()
  player.addComponent(
    'Draw',
    new DrawComponent({
      entity: player,
      child: {
        sprite: createSprite('player'),
        state: 'Dying',
      },
    })
  )
  player.addComponent('Position', new PositionComponent(0, -120))
  world.addEntity(player)

  const position = player.getComponent('Position')
  const draw = player.getComponent('Draw')

  while (position.y < 160) {
    position.y += 1
    draw.angle += 5
    yield
  }
}

const waitInput = function*(): Behaviour<void> {
  while (!MouseController.isMousePressed('Left')) yield
}

export const openingFlow = function*(): Flow {
  const world = new OpeningWorldFactory().create()
  yield* parallelAny([
    (function*(): Generator<void> {
      yield* parallelAny([player(world), camera(world), waitInput()])
      yield* FadeOut(world)
    })(),
    world.execute(),
  ])
  world.end()

  saveData({
    ...loadData(),
    storyStatus: StoryStatus.Stage,
  })

  const { spawnPoint, playerData } = loadData()
  return gameFlow(spawnPoint, playerData)
}
