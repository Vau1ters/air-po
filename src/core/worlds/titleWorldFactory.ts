import { World } from './../../core/ecs/world'
import { application, windowSize } from './../../core/application'
import PhysicsSystem from './../../core/systems/physicsSystem'
import GravitySystem from './../../core/systems/gravitySystem'
import { Container, Sprite, Texture, BaseTexture, Graphics } from 'pixi.js'
import DrawSystem from './../../core/systems/drawSystem'
import { AirSystem } from './../../core/systems/airSystem'
import CameraSystem from './../../core/systems/cameraSystem'
import { ControlSystem } from './../../core/systems/controlSystem'
import { PlayerControlSystem } from './../../core/systems/playerControlSystem'
import { BulletSystem } from './../../core/systems/bulletSystem'
import { MapBuilder } from './../../map/mapBuilder'
import map from './../../../res/teststage.json'
import { FamilyBuilder } from './../../core/ecs/family'
import { AirHolderSystem } from './../../core/systems/airHolderSystem'
import titleImg from './../../../res/title.png'
import { Behaviour } from '../ai/behaviour'
import { GameWorldFactory } from './gameWorldFactory'
import { wait } from '../ai/action/wait'

const titleWorldBehaviour = (stage: Container) =>
  function*(): Behaviour<World> {
    let displayClicked = false
    stage.addListener(
      'pointerdown',
      () => {
        displayClicked = true
      },
      { once: true }
    )

    while (!displayClicked) {
      yield
    }
    yield* wait(30)

    return new GameWorldFactory().create()
  }

export class TitleWorldFactory {
  public create(): World {
    const gameWorldContainer = new Container()

    const background = new Graphics()
    background.beginFill(0xc0c0c0)
    background.drawRect(0, 0, windowSize.width, windowSize.height)
    background.endFill()
    gameWorldContainer.addChild(background)

    const drawContainer = new Container()
    drawContainer.filterArea = application.screen
    gameWorldContainer.addChild(drawContainer)

    const base = BaseTexture.from(titleImg)
    const title = new Sprite(new Texture(base))
    title.interactive = true
    gameWorldContainer.addChild(title)

    const world = new World(titleWorldBehaviour(title))
    world.stage.addChild(gameWorldContainer)

    const airSystem = new AirSystem(world, gameWorldContainer)

    world.addSystem(
      new PhysicsSystem(world),
      new GravitySystem(world),
      new PlayerControlSystem(world),
      new BulletSystem(world),
      airSystem,
      new AirHolderSystem(world),
      new DrawSystem(world, drawContainer),
      new CameraSystem(world, drawContainer),
      new ControlSystem(world)
    )

    const mapBuilder = new MapBuilder(world)
    mapBuilder.build(map)

    for (const player of new FamilyBuilder(world).include('Player').build().entityIterator) {
      const position = player.getComponent('Position')
      airSystem.offset = position
    }

    return world
  }
}
