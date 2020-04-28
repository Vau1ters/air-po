import { World } from './core/ecs/world'
import { PositionComponent } from './core/components/positionComponent'
import DebugDrawSystem from './core/systems/debugDrawSystem'
import { application, initializeApplication } from './core/application'
import PhysicsSystem from './core/systems/physicsSystem'
import GravitySystem from './core/systems/gravitySystem'
import { Container, Graphics } from 'pixi.js'
import DrawSystem from './core/systems/drawSystem'
import { AirSystem } from './core/systems/airSystem'
import { KeyController } from './core/controller'
import { PlayerControlSystem } from './core/systems/playerControlSystem'
import { PlayerFactory } from './core/entities/playerFactory'
import { WallFactory } from './core/entities/wallFactory'
import * as Art from './core/graphics/art'
import { AirFactory } from './core/entities/airFactory'
import UiSystem from './core/systems/uiSystem'

export class Main {
  public static world = new World()
  /*+.† INITIALIZATION †.+*/
  public static init(): void {
    initializeApplication()
    KeyController.init()
    Art.init()

    const drawContainer = new Container()
    application.stage.addChild(drawContainer)

    // for air filter
    const bg = new Graphics()
    bg.beginFill(0x000000, 0)
    bg.drawRect(0, 0, 320, 240)
    bg.endFill()
    drawContainer.addChild(bg)

    const uiContainer = new Container()
    uiContainer.zIndex = 1
    application.stage.addChild(uiContainer)

    const debugContainer = new Container()
    debugContainer.zIndex = Infinity
    application.stage.addChild(debugContainer)

    this.world.addSystem(
      new PhysicsSystem(this.world),
      new GravitySystem(this.world),
      new PlayerControlSystem(this.world),
      new DrawSystem(this.world, drawContainer),
      new AirSystem(this.world, drawContainer),
      new UiSystem(this.world, uiContainer),
      new DebugDrawSystem(this.world, debugContainer)
    )
    const player = new PlayerFactory().create()
    {
      const position = player.getComponent('Position') as PositionComponent
      position.x = 100
      position.y = 50
    }
    this.world.addEntity(player)

    const air1 = new AirFactory()
      .setPosition(200, 120)
      .setQuantity(1600)
      .create()
    this.world.addEntity(air1)
    const air2 = new AirFactory()
      .setPosition(120, 130)
      .setQuantity(900)
      .create()
    this.world.addEntity(air2)

    console.log(this.world.entities)

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
