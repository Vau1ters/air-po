import { World } from './core/ecs/world'
import { PositionComponent } from './core/components/positionComponent'
import DebugDrawSystem from './core/systems/debugDrawSystem'
import { application, initializeApplication } from './core/application'
import PhysicsSystem from './core/systems/physicsSystem'
import GravitySystem from './core/systems/gravitySystem'
import { Container } from 'pixi.js'
import DrawSystem from './core/systems/drawSystem'
import { KeyController } from './core/controller'
import { PlayerControlSystem } from './core/systems/playerControlSystem'
import { PlayerFactory } from './core/entities/playerFactory'
import { WallFactory } from './core/entities/wallFactory'

export class Main {
  public static world = new World()
  /*+.† INITIALIZATION †.+*/
  public static init(): void {
    initializeApplication()
    KeyController.init()

    const debugContainer = new Container()
    debugContainer.zIndex = Infinity
    application.stage.addChild(debugContainer)

    this.world.addSystem(
      new PhysicsSystem(this.world),
      new GravitySystem(this.world),
      new PlayerControlSystem(this.world),
      new DrawSystem(this.world, application.stage),
      new DebugDrawSystem(this.world, debugContainer)
    )
    const player = new PlayerFactory().create()
    const position = player.getComponent('Position') as PositionComponent
    position.x = 400
    position.y = 200
    this.world.addEntity(player)

    for (let x = 0; x < 50; x++) {
      const wall = new WallFactory().create()
      const p = wall.getComponent('Position') as PositionComponent
      p.x = 32 * x
      p.y = 500
      this.world.addEntity(wall)
    }
    application.ticker.add((delta: number) => this.world.update(delta / 60))
  }
}
Main.init()
