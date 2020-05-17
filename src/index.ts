import { World } from './core/ecs/world'
import { PositionComponent } from './core/components/positionComponent'
import DebugDrawSystem from './core/systems/debugDrawSystem'
import { application, initializeApplication } from './core/application'
import PhysicsSystem from './core/systems/physicsSystem'
import GravitySystem from './core/systems/gravitySystem'
import { Container, Rectangle } from 'pixi.js'
import DrawSystem from './core/systems/drawSystem'
import { AirSystem } from './core/systems/airSystem'
import CameraSystem from './core/systems/cameraSystem'
import { KeyController } from './core/controller'
import { PlayerControlSystem } from './core/systems/playerControlSystem'
import { BulletSystem } from './core/systems/bulletSystem'
import { PlayerFactory } from './core/entities/playerFactory'
import { Entity } from './core/ecs/entity'
import { BVHComponent } from './core/components/bvhComponent'
import * as Art from './core/graphics/art'
import { AirFactory } from './core/entities/airFactory'
import UiSystem from './core/systems/uiSystem'
import { MapBuilder } from './map/mapBuilder'
import map from '../res/teststage.json'

export class Main {
  public static world = new World()
  /*+.† INITIALIZATION †.+*/
  public static init(): void {
    initializeApplication()
    KeyController.init()
    Art.init()

    const gameWorldContainer = new Container()
    application.stage.addChild(gameWorldContainer)

    const drawContainer = new Container()
    gameWorldContainer.addChild(drawContainer)
    drawContainer.filterArea = new Rectangle(0, 0, 800, 600)

    const debugContainer = new Container()
    debugContainer.zIndex = Infinity
    gameWorldContainer.addChild(debugContainer)

    const uiContainer = new Container()
    uiContainer.zIndex = Infinity
    application.stage.addChild(uiContainer)

    const airSystem = new AirSystem(this.world, drawContainer)
    const cameraSystem = new CameraSystem(
      this.world,
      gameWorldContainer,
      drawContainer
    )
    const physicsSystem = new PhysicsSystem(this.world)

    this.world.addSystem(
      physicsSystem,
      new GravitySystem(this.world),
      new PlayerControlSystem(this.world),
      new BulletSystem(this.world),
      new DrawSystem(this.world, drawContainer),
      airSystem,
      new UiSystem(this.world, uiContainer),
      new DebugDrawSystem(this.world, debugContainer),
      cameraSystem
    )

    const air1 = new AirFactory()
      .setPosition(250, 80)
      .setQuantity(2000)
      .create()
    this.world.addEntity(air1)
    const air2 = new AirFactory()
      .setPosition(180, 100)
      .setQuantity(1200)
      .create()
    this.world.addEntity(air2)
    const air3 = new AirFactory()
      .setPosition(240, 200)
      .setQuantity(3000)
      .create()
    this.world.addEntity(air3)
    const air4 = new AirFactory()
      .setPosition(160, 260)
      .setQuantity(1000)
      .create()
    this.world.addEntity(air4)

    const player = new PlayerFactory().create()
    const position = player.getComponent('Position') as PositionComponent
    position.x = 100
    position.y = 50
    this.world.addEntity(player)

    cameraSystem.chaseTarget = position
    airSystem.offset = position

    const mapBuilder = new MapBuilder(this.world)
    mapBuilder.build(map)
    const bvhEntity = new Entity()
    bvhEntity.addComponent('BVH', new BVHComponent())
    this.world.addEntity(bvhEntity)

    application.ticker.add((delta: number) => this.world.update(delta / 60))
  }
}
Main.init()
