import { World } from './core/ecs/world'
import { PositionComponent } from './core/components/positionComponent'
import { VelocityComponent } from './core/components/velocityComponent'
import { Entity } from './core/ecs/entity'
import DebugDrawSystem from './core/systems/debugDrawSystem'
import { application, initializeApplication } from './core/application'
import PhysicsSystem from './core/systems/physicsSystem'
import GravitySystem from './core/systems/gravitySystem'
import { Container, Graphics } from 'pixi.js'
import DrawSystem from './core/systems/drawSystem'
import { DrawComponent } from './core/components/drawComponent'
import { PlayerComponent } from './core/components/playerComponent'
import { KeyController } from './core/controller'
import { PlayerControlSystem } from './core/systems/playerControlSystem'

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
    const position1 = new PositionComponent(200, 100)
    const velocity1 = new VelocityComponent(30, 0)
    const entity1 = new Entity()
    entity1.addComponent('Position', position1)
    entity1.addComponent('Velocity', velocity1)
    this.world.addEntity(entity1)

    const position2 = new PositionComponent(500, 300)
    const velocity2 = new VelocityComponent(-20, -100)
    const draw2 = new DrawComponent()
    const player2 = new PlayerComponent()
    const entity2 = new Entity()
    entity2.addComponent('Position', position2)
    entity2.addComponent('Velocity', velocity2)
    entity2.addComponent('Draw', draw2)
    entity2.addComponent('Player', player2)
    this.world.addEntity(entity2)
    const po = new Graphics()
    po.beginFill(0xffff00)
    po.drawCircle(0, 0, 50)
    draw2.addChild(po)

    application.ticker.add((delta: number) => this.world.update(delta / 60))
  }
}
Main.init()
