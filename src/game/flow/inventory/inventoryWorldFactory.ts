import { World } from '@core/ecs/world'
import { ControlSystem } from '@game/systems/controlSystem'
import DrawSystem from '@game/systems/drawSystem'
import { Container } from 'pixi.js'
import { windowSize } from '@core/application'
import { SingletonSystem } from '@game/systems/singletonSystem'
import AISystem from '@game/systems/aiSystem'
import { Entity } from '@core/ecs/entity'
import { PositionComponent } from '@game/components/positionComponent'
import { CameraComponent } from '@game/components/cameraComponent'
import CollisionSystem from '@game/systems/collisionSystem'

export class InventoryWorldFactory {
  public create(): World {
    const world = new World()

    const rootContainer = new Container()
    rootContainer.filters = rootContainer.filters || [] // undefinedの場合は空配列を入れる
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
      new AISystem(world),
      new CollisionSystem(world),
      new SingletonSystem(world)
    )

    const camera = new Entity()
    camera.addComponent(
      'Position',
      new PositionComponent(windowSize.width / 2, windowSize.height / 2)
    )
    camera.addComponent('Camera', new CameraComponent([]))
    world.addEntity(camera)

    return world
  }
}
