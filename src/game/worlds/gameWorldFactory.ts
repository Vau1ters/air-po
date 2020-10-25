import { World } from '@core/ecs/world'
import DebugDrawSystem from '../systems/debugDrawSystem'
import { application, windowSize } from '../../core/application'
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
import { MapBuilder } from '../map/mapBuilder'
import AISystem from '../systems/aiSystem'
import InvincibleSystem from '../systems/invincibleSystem'
import { DamageSystem } from '../systems/damageSystem'
import map from '../../../res/map/teststage.json'
import { AirHolderSystem } from '../systems/airHolderSystem'
import * as PIXI from 'pixi.js'
import { FilterSystem } from '../systems/filterSystem'
import { LightSystem } from '../systems/lightSystem'
import { gameWorldAI } from '@game/ai/world/gameWorld'

export class GameWorldFactory {
  public create(): World {
    const world = new World(gameWorldAI)

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
