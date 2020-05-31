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
import * as Art from './core/graphics/art'
import UiSystem from './core/systems/uiSystem'
import { MapBuilder } from './map/mapBuilder'
import { Enemy1Factory } from './core/entities/enemy1Factory'
import AISystem from './core/systems/aiSystem'
import InvincibleSystem from './core/systems/invincibleSystem'
import { DamageSystem } from './core/systems/damageSystem'
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

    this.world.addSystem(
      new AISystem(this.world),
      new PhysicsSystem(this.world),
      new GravitySystem(this.world),
      new PlayerControlSystem(this.world),
      new BulletSystem(this.world),
      new InvincibleSystem(this.world),
      new DamageSystem(this.world),
      airSystem,
      new DrawSystem(this.world, drawContainer),
      new UiSystem(this.world, uiContainer),
      new DebugDrawSystem(this.world, debugContainer),
      cameraSystem
    )

    // 主人公
    const player = new PlayerFactory().create()
    const position = player.getComponent('Position') as PositionComponent
    position.x = 100
    position.y = 50
    this.world.addEntity(player)

    // 敵
    const enemy1 = new Enemy1Factory().create()
    const enemyPosition = enemy1.getComponent('Position') as PositionComponent
    enemyPosition.x = 160
    enemyPosition.y = 140
    this.world.addEntity(enemy1)

    cameraSystem.chaseTarget = position
    airSystem.offset = position

    const mapBuilder = new MapBuilder(this.world)
    mapBuilder.build(map)

    application.ticker.add((delta: number) => this.world.update(delta / 60))

    /* eslint @typescript-eslint/no-var-requires: 0 */
    const Stats = require('stats.js')

    const stats = new Stats()
    stats.showPanel(1) // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom)

    application.ticker.add(() => stats.update())
  }
}
Main.init()
