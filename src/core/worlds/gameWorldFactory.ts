import { World } from './../../core/ecs/world'
import DebugDrawSystem from './../../core/systems/debugDrawSystem'
import { application, windowSize } from './../../core/application'
import PhysicsSystem from './../../core/systems/physicsSystem'
import GravitySystem from './../../core/systems/gravitySystem'
import { Container } from 'pixi.js'
import DrawSystem from './../../core/systems/drawSystem'
import { AirSystem } from './../../core/systems/airSystem'
import CameraSystem from './../../core/systems/cameraSystem'
import { ControlSystem } from './../../core/systems/controlSystem'
import { PlayerControlSystem } from './../../core/systems/playerControlSystem'
import { BulletSystem } from './../../core/systems/bulletSystem'
import UiSystem from './../../core/systems/uiSystem'
import { MapBuilder } from './../../map/mapBuilder'
import AISystem from './../../core/systems/aiSystem'
import InvincibleSystem from './../../core/systems/invincibleSystem'
import { DamageSystem } from './../../core/systems/damageSystem'
import map from './../../../res/teststage.json'
import { FamilyBuilder } from './../../core/ecs/family'
import { AirHolderSystem } from './../../core/systems/airHolderSystem'
import * as PIXI from 'pixi.js'
import { Behaviour } from '../ai/behaviour'
import { TitleWorldFactory } from './titleWorldFactory'
import { isAlive } from '../ai/condition/isAlive'
import { assert } from '../../utils/assertion'
import { wait } from '../ai/action/wait'
import { FilterSystem } from '../systems/filterSystem'
import { LightSystem } from '../systems/lightSystem'
import { SensorSystem } from '../systems/sensorSystem'

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

    world.addSystem(
      new AISystem(world),
      new PhysicsSystem(world),
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
      new DebugDrawSystem(world, debugContainer),
      new CameraSystem(world, gameWorldContainer, background),
      new ControlSystem(world),
      new SensorSystem(world)
    )

    const mapBuilder = new MapBuilder(world)
    mapBuilder.build(map)

    return world
  }
}
