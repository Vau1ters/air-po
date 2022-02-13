import { World } from '@core/ecs/world'
import { ControlSystem } from '@game/systems/controlSystem'
import DrawSystem from '@game/systems/drawSystem'
import { Container } from 'pixi.js'
import { CameraFactory } from '@game/entities/cameraFactory'
import { SingletonSystem } from '@game/systems/singletonSystem'

export class SettingWorldFactory {
  public create(): World {
    const world = new World()

    const rootContainer = new Container()
    world.stage.addChild(rootContainer)

    const worldContainer = new Container()
    rootContainer.addChild(worldContainer)

    const worldUIContainer = new Container()
    worldUIContainer.zIndex = Infinity
    worldContainer.addChild(worldUIContainer)

    const uiContainer = new Container()
    rootContainer.addChild(uiContainer)

    world.addSystem(
      new ControlSystem(world),
      new DrawSystem(world, worldContainer, worldUIContainer, uiContainer),
      new SingletonSystem(world)
    )

    const camera = new CameraFactory().create()
    world.addEntity(camera)

    return world
  }
}
