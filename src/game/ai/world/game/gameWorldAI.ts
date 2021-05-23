import { Behaviour } from '@core/behaviour/behaviour'
import { parallelAll } from '@core/behaviour/composite'
import { wait } from '@core/behaviour/wait'
import { FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { KeyController } from '@game/systems/controlSystem'
import { GameWorldFactory } from '@game/worlds/gameWorldFactory'
import { PauseWorldFactory } from '@game/worlds/pauseWorldFactory'
import { FadeIn } from '../common/animation/fadeIn'
import { Text } from './text'
import { isPlayerAlive } from '../common/condition/isPlayerAlive'
import { Map } from '@game/map/mapBuilder'
import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { DrawComponent } from '@game/components/drawComponent'
import background1Definition from '@res/setting/background1.json'
import { parseAnimation } from '@core/graphics/animationParser'

const game = function*(world: World): Behaviour<void> {
  const playerFamily = new FamilyBuilder(world).include('Player').build()
  const isGameOn = isPlayerAlive(playerFamily)
  const shouldPause = (): boolean => KeyController.isActionPressed('Pause')
  while (isGameOn()) {
    if (shouldPause()) {
      const pauseWorld = new PauseWorldFactory().create(world)
      pauseWorld.start()
      world.pause()
    }
    yield
  }
}

export const gameWorldAI = (map: Map) =>
  function*(world: World): Behaviour<void> {
    const bg = new Entity()
    bg.addComponent('Background', { scrollSpeed: new Vec2(0.9, 0.9) })
    bg.addComponent('Position', new Vec2())
    const drawComponent = new DrawComponent({
      entity: bg,
      child: {
        sprite: parseAnimation(background1Definition),
      },
    })
    drawComponent.zIndex = -Infinity
    bg.addComponent('Draw', drawComponent)
    world.addEntity(bg)

    yield* FadeIn(world)

    yield* parallelAll([game(world), Text(world, 'そうなんちてん')])

    yield* wait(60)

    const playerFamily = new FamilyBuilder(world).include('Player').build()
    const [player] = playerFamily.entityArray
    const gameWorldFactory = new GameWorldFactory()
    const gameWorld = gameWorldFactory.create(map)
    gameWorldFactory.respawnPlayer(player)
    gameWorld.start()
    return
  }
