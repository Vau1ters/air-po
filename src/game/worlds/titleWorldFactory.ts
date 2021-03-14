import { World } from '@core/ecs/world'
import { application, windowSize } from '@core/application'
import { Container, Graphics } from 'pixi.js'
import DrawSystem from '@game/systems/drawSystem'
import CameraSystem from '@game/systems/cameraSystem'
import { ControlSystem } from '@game/systems/controlSystem'
import { MapBuilder } from '@game/map/mapBuilder'
import map from '@res/map/teststage.json'
import { titleWorldAI } from '@game/ai/world/title/titleWorldAI'

export class TitleWorldFactory {
  public create(): World {
    const world = new World(titleWorldAI)

    const rootContainer = new Container()
    world.stage.addChild(rootContainer)

    const worldContainer = new Container()
    worldContainer.filterArea = application.screen
    rootContainer.addChild(worldContainer)

    const background = new Graphics()
    background.beginFill(0xc0c0c0)
    background.drawRect(0, 0, windowSize.width, windowSize.height)
    background.endFill()
    worldContainer.addChild(background)

    const worldUIContainer = new Container()
    worldUIContainer.zIndex = Infinity
    worldContainer.addChild(worldUIContainer)

    world.addSystem(
      new DrawSystem(world, worldContainer, worldUIContainer),
      new CameraSystem(world, worldContainer, background),
      new ControlSystem(world)
    )

    const mapBuilder = new MapBuilder(world)
    mapBuilder.build(map, 0)

    return world
  }
}
