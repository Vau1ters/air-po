import { World } from '../world'
import DebugDrawSystem from '../systems/debugDrawSystem'
import { application, windowSize } from '../../application'
import PhysicsSystem from '../systems/physicsSystem'
import GravitySystem from '../systems/gravitySystem'
import { Container } from 'pixi.js'
import DrawSystem from '../systems/drawSystem'
import { AirSystem } from '../systems/airSystem'
import CameraSystem from '../systems/cameraSystem'
import { ControlSystem } from '../systems/controlSystem'
import { PlayerControlSystem } from '../systems/playerControlSystem'
import { BulletSystem } from '../systems/bulletSystem'
import UiSystem from '../systems/uiSystem'
import { MapBuilder } from '../../map/mapBuilder'
import AISystem from '../systems/aiSystem'
import InvincibleSystem from '../systems/invincibleSystem'
import { DamageSystem } from '../systems/damageSystem'
import map from '../../../res/map/teststage.json'
import { FamilyBuilder } from '../family'
import { AirHolderSystem } from '../systems/airHolderSystem'
import * as PIXI from 'pixi.js'
import { Behaviour } from '../../behaviour/behaviour'
import { TitleWorldFactory } from './titleWorldFactory'
import { isAlive } from '../../behaviour/entityAI/common/condition/isAlive'
import { assert } from '../../utils/assertion'
import { wait } from '../../behaviour/wait'
import { FilterSystem } from '../systems/filterSystem'
import { LightSystem } from '../systems/lightSystem'

const gameWorldBehaviour = function*(world: World): Behaviour<World> {
  const playerFamily = new FamilyBuilder(world).include('Player').build()
  assert(playerFamily.entityArray.length === 1)
  const playerEntity = playerFamily.entityArray[0]
  const isPlayerAlive = isAlive(playerEntity)

  while (isPlayerAlive()) {
    yield
  }
  yield* wait(60)

  return new TitleWorldFactory().create()
}

export class GameWorldFactory {
  public create(): World {
    const world = new World(gameWorldBehaviour)

    const gameWorldContainer = new Container()
    world.stage.addChild(gameWorldContainer)

    const drawContainer = new Container()
    gameWorldContainer.addChild(drawContainer)
    drawContainer.filterArea = application.screen

    const background = new PIXI.Graphics()
    background.beginFill(0xc0c0c0)
    background.drawRect(0, 0, windowSize.width, windowSize.height)
    background.endFill()
    drawContainer.addChild(background)

    const gameWorldUiContainer = new Container()
    gameWorldUiContainer.zIndex = Infinity
    drawContainer.addChild(gameWorldUiContainer)

    const debugContainer = new Container()
    debugContainer.zIndex = Infinity
    gameWorldContainer.addChild(debugContainer)

    const uiContainer = new Container()
    uiContainer.zIndex = Infinity
    world.stage.addChild(uiContainer)

    const physicsSystem = new PhysicsSystem(world)
    world.addSystem(
      new AISystem(world),
      physicsSystem,
      new GravitySystem(world),
      new PlayerControlSystem(world),
      new BulletSystem(world),
      new InvincibleSystem(world),
      new DamageSystem(world),
      new FilterSystem(world, gameWorldContainer),
      new AirSystem(world),
      new LightSystem(world),
      new AirHolderSystem(world),
      new DrawSystem(world, drawContainer),
      new UiSystem(world, uiContainer, gameWorldUiContainer),
      new DebugDrawSystem(world, debugContainer, physicsSystem),
      new CameraSystem(world, gameWorldContainer, background),
      new ControlSystem(world)
    )

    const mapBuilder = new MapBuilder(world)
    mapBuilder.build(map)

    return world
  }
}
