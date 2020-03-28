import { World } from './core/ecs/world'
import { PositionComponent } from './core/components/positionComponent'
import DebugDrawSystem from './core/systems/debugDrawSystem'
import { application, initializeApplication } from './core/application'
import PhysicsSystem from './core/systems/physicsSystem'
import GravitySystem from './core/systems/gravitySystem'
import { Container, Graphics } from 'pixi.js'
import DrawSystem from './core/systems/drawSystem'
import { KeyController } from './core/controller'
import { PlayerControlSystem } from './core/systems/playerControlSystem'
import { PlayerFactory } from './core/entities/playerFactory'
import { WallFactory } from './core/entities/wallFactory'
import { AirFilter } from './filters/airFilter'
import * as Art from './core/graphics/art'

export class Main {
  public static world = new World()
  /*+.† INITIALIZATION †.+*/
  public static init(): void {
    initializeApplication()
    KeyController.init()
    Art.init()

    // air
    const airFilter = new AirFilter({ x: 800, y: 600 })
    airFilter.airs = [
      {
        center: {
          x: 600,
          y: 250,
        },
        radius: 80,
      },
      {
        center: {
          x: 400,
          y: 300,
        },
        radius: 100,
      },
    ]
    application.stage.filters = [airFilter]
    const bg = new Graphics()
    bg.beginFill(0x000000, 0)
    bg.drawRect(0, 0, 800, 600)
    bg.endFill()
    application.stage.addChild(bg)

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
    position.x = 100
    position.y = 50
    this.world.addEntity(player)

    for (let x = 0; x < 50; x++) {
      const wall = new WallFactory().create()
      const p = wall.getComponent('Position') as PositionComponent
      p.x = 8 * x
      if (x < 16) {
        p.y = 50 + 8 * x
      } else {
        p.y = 178
      }
      this.world.addEntity(wall)
    }
    application.ticker.add((delta: number) => this.world.update(delta / 60))
  }
}
Main.init()
