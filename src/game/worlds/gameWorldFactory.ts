import { World } from '@core/ecs/world'
import DebugDrawSystem from '@game/systems/debugDrawSystem'
import { application, windowSize } from '@core/application'
import PhysicsSystem from '@game/systems/physicsSystem'
import GravitySystem from '@game/systems/gravitySystem'
import { Container } from 'pixi.js'
import DrawSystem from '@game/systems/drawSystem'
import { AirSystem } from '@game/systems/airSystem'
import CameraSystem from '@game/systems/cameraSystem'
import { ControlSystem } from '@game/systems/controlSystem'
import { PlayerControlSystem } from '@game/systems/playerControlSystem'
import { BulletSystem } from '@game/systems/bulletSystem'
import UiSystem from '@game/systems/uiSystem'
import { Map, MapBuilder } from '@game/map/mapBuilder'
import AISystem from '@game/systems/aiSystem'
import InvincibleSystem from '@game/systems/invincibleSystem'
import { DamageSystem } from '@game/systems/damageSystem'
import { AirHolderSystem } from '@game/systems/airHolderSystem'
import * as PIXI from 'pixi.js'
import { FilterSystem } from '@game/systems/filterSystem'
import { LightSystem } from '@game/systems/lightSystem'
import { EventSensorSystem } from '@game/systems/eventSensorSystem'
import { gameWorldAI } from '@game/ai/world/game/gameWorldAI'
import CollisionSystem from '@game/systems/collisionSystem'
import { LaserSightFactory } from '@game/entities/laserSightFactory'

export class GameWorldFactory {
  public create(map: Map, playerSpawnerID: number): World {
    const world = new World(gameWorldAI)

    const rootContainer = new Container()
    world.stage.addChild(rootContainer)

    const worldContainer = new Container()
    rootContainer.addChild(worldContainer)
    worldContainer.filterArea = application.screen

    const background = new PIXI.Graphics()
    background.beginFill(0xc0c0c0)
    background.drawRect(0, 0, windowSize.width, windowSize.height)
    background.endFill()
    worldContainer.addChild(background)

    const worldUIContainer = new Container()
    worldUIContainer.zIndex = Infinity
    worldContainer.addChild(worldUIContainer)

    const debugContainer = new Container()
    debugContainer.zIndex = Infinity
    rootContainer.addChild(debugContainer)

    const uiContainer = new Container()
    uiContainer.zIndex = Infinity
    world.stage.addChild(uiContainer)

    const collisionSystem = new CollisionSystem(world)
    world.addSystem(
      new AISystem(world),
      new PhysicsSystem(world),
      collisionSystem,
      new GravitySystem(world),
      new PlayerControlSystem(world),
      new BulletSystem(world),
      new InvincibleSystem(world),
      new DamageSystem(world),
      new FilterSystem(world, rootContainer),
      new AirSystem(world),
      new LightSystem(world),
      new AirHolderSystem(world),
      new DrawSystem(world, worldContainer, worldUIContainer),
      new UiSystem(world, uiContainer, worldUIContainer),
      new DebugDrawSystem(world, debugContainer, collisionSystem),
      new CameraSystem(world, rootContainer, background),
      new ControlSystem(world),
      new EventSensorSystem(world)
    )

    const mapBuilder = new MapBuilder(world)
    mapBuilder.build(map, playerSpawnerID)

    world.addEntity(new LaserSightFactory(world).create())

    return world
  }
}
