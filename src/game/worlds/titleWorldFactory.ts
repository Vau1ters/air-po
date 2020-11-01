import { World } from './../../core/ecs/world'
import { application, windowSize } from './../../core/application'
import { Container, Sprite, Graphics } from 'pixi.js'
import DrawSystem from './../../core/systems/drawSystem'
import CameraSystem from './../../core/systems/cameraSystem'
import { ControlSystem, MouseController } from './../../core/systems/controlSystem'
import { MapBuilder } from './../../map/mapBuilder'
import map from './../../../res/teststage.json'
import { GameWorldFactory } from './gameWorldFactory'
import { transition } from '../ai/action/transition'
import { textureStore } from '../graphics/art'
import { Behaviour } from '../behaviour/behaviour'

const titleWorldBehaviour = (titleImage: Sprite) =>
  function*(): Behaviour<World> {
    while (!MouseController.isMousePressed('Left')) yield
    yield* transition(12, (time: number) => {
      const rate = time / 12
      titleImage.alpha = (Math.cos(rate * Math.PI * 4) + 1) / 2
    })
    yield* transition(16, (time: number) => {
      const rate = time / 16
      titleImage.alpha = Math.cos((rate * Math.PI) / 2)
    })

    return new GameWorldFactory().create(map, 0)
  }

export class TitleWorldFactory {
  public create(): World {
    const gameWorldContainer = new Container()

    const drawContainer = new Container()
    drawContainer.filterArea = application.screen
    gameWorldContainer.addChild(drawContainer)

    const background = new Graphics()
    background.beginFill(0xc0c0c0)
    background.drawRect(0, 0, windowSize.width, windowSize.height)
    background.endFill()
    drawContainer.addChild(background)

    const title = new Sprite(textureStore.title[0])
    title.interactive = true

    const world = new World(titleWorldBehaviour(title))
    world.stage.addChild(gameWorldContainer)
    world.stage.addChild(title)

    world.addSystem(
      new DrawSystem(world, drawContainer),
      new CameraSystem(world, drawContainer, background),
      new ControlSystem(world)
    )

    const mapBuilder = new MapBuilder(world)
    mapBuilder.build(map, 0)

    return world
  }
}
