import { World } from '@core/ecs/world'
import { windowSize } from '@core/application'
import { ControlSystem } from '@game/systems/controlSystem'
import { pauseWorldAI } from '@game/ai/world/pause/pauseWorldAI'
import * as PIXI from 'pixi.js'

export class PauseWorldFactory {
  public create(gameWorld: World): World {
    const world = new World(pauseWorldAI(gameWorld))

    const background = new PIXI.Graphics()
    background.beginFill(0xc0c0c0)
    background.drawRect(0, 0, windowSize.width / 2, windowSize.height / 2)
    background.endFill()
    world.stage.addChild(background)

    world.addSystem(new ControlSystem(world))

    return world
  }
}
