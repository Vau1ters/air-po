import { World } from './core/ecs/world'
import { PositionComponent } from './core/components/positionComponent'
import DebugDrawSystem from './core/systems/debugDrawSystem'
import { application, initializeApplication } from './core/application'
import PhysicsSystem from './core/systems/physicsSystem'
import GravitySystem from './core/systems/gravitySystem'
import { Container } from 'pixi.js'
import DrawSystem from './core/systems/drawSystem'
import { AirSystem } from './core/systems/airSystem'
import CameraSystem from './core/systems/cameraSystem'
import { KeyController } from './core/controller'
import { PlayerControlSystem } from './core/systems/playerControlSystem'
import { BulletSystem } from './core/systems/bulletSystem'
import * as Art from './core/graphics/art'
import UiSystem from './core/systems/uiSystem'
import { MapBuilder } from './map/mapBuilder'
import AISystem from './core/systems/aiSystem'
import InvincibleSystem from './core/systems/invincibleSystem'
import { DamageSystem } from './core/systems/damageSystem'
import map from '../res/teststage.json'
import { FamilyBuilder } from './core/ecs/family'

export class Main {
  public static world = new World()
  /*+.† INITIALIZATION †.+*/
  public static async init(): Promise<void> {
    initializeApplication()
    KeyController.init()
    await Art.init()

    const gameWorldContainer = new Container()
    application.stage.addChild(gameWorldContainer)

    const drawContainer = new Container()
    gameWorldContainer.addChild(drawContainer)
    drawContainer.filterArea = application.screen

    const debugContainer = new Container()
    debugContainer.zIndex = Infinity
    gameWorldContainer.addChild(debugContainer)

    const gameWorldUiContainer = new Container()
    gameWorldUiContainer.zIndex = Infinity
    gameWorldContainer.addChild(gameWorldUiContainer)

    const uiContainer = new Container()
    uiContainer.zIndex = Infinity
    application.stage.addChild(uiContainer)

    const airSystem = new AirSystem(this.world, drawContainer)
    const cameraSystem = new CameraSystem(this.world, gameWorldContainer)

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
      new UiSystem(this.world, uiContainer, gameWorldUiContainer),
      new DebugDrawSystem(this.world, debugContainer),
      cameraSystem
    )

    const mapBuilder = new MapBuilder(this.world)
    mapBuilder.build(map)

    for (const player of new FamilyBuilder(this.world).include('Player').build().entityIterator) {
      const position = player.getComponent('Position') as PositionComponent
      cameraSystem.chaseTarget = position
      airSystem.offset = position
    }

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
