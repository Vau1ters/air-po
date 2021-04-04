import { World } from '@core/ecs/world'
import { ControlSystem } from '@game/systems/controlSystem'
import { pauseWorldAI } from '@game/ai/world/pause/pauseWorldAI'
import DrawSystem from '@game/systems/drawSystem'
import { Entity } from '@core/ecs/entity'
import { CameraComponent } from '@game/components/cameraComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { Container, filters, Graphics } from 'pixi.js'
import { windowSize } from '@core/application'

export class PauseWorldFactory {
  public create(gameWorld: World): World {
    const alphaFilter = new filters.AlphaFilter(0)

    const world = new World(pauseWorldAI(gameWorld, alphaFilter))

    const background = new Graphics()
    background.beginFill(0, 0.5)
    background.drawRect(0, 0, windowSize.width, windowSize.height)
    background.endFill()

    const rootContainer = new Container()
    rootContainer.filters = rootContainer.filters || [] // undefinedの場合は空配列を入れる
    rootContainer.filters.push(alphaFilter)
    world.stage.addChild(rootContainer)

    const worldContainer = new Container()
    rootContainer.addChild(worldContainer)

    worldContainer.addChild(background)

    const worldUIContainer = new Container()
    worldUIContainer.zIndex = Infinity
    worldContainer.addChild(worldUIContainer)

    world.addSystem(
      new ControlSystem(world),
      new DrawSystem(world, worldContainer, worldUIContainer)
    )

    console.log('POj')

    const camera = new Entity()
    camera.addComponent('Camera', new CameraComponent())
    camera.addComponent('Position', new PositionComponent(160, 120))
    world.addEntity(camera)

    return world
  }
}
