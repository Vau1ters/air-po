import { World } from './core/ecs/world'
import { PositionComponent } from './core/components/positionComponent'
import { VelocityComponent } from './core/components/velocityComponent'
import { Entity } from './core/ecs/entity'
import DrawSystem from './core/systems/debugDrawSystem'
import { application, initializeApplication } from './core/application'
import PhysicsSystem from './core/systems/physicsSystem'
import GravitySystem from './core/systems/gravitySystem'
import { Graphics } from 'pixi.js'

export class Main {
  public static world = new World()
  /*+.† INITIALIZATION †.+*/
  public static init(): void {
    initializeApplication()

    const graphics = new Graphics()
    application.stage.addChild(graphics)

    this.world.addSystem(
      new PhysicsSystem(this.world),
      new GravitySystem(this.world),
      new DrawSystem(this.world, graphics)
    )
    const position1 = new PositionComponent(200, 100)
    const velocity1 = new VelocityComponent(30, 0)
    const entity1 = new Entity()
    entity1.addComponent('Position', position1)
    entity1.addComponent('Velocity', velocity1)
    this.world.addEntity(entity1)

    const position2 = new PositionComponent(500, 300)
    const velocity2 = new VelocityComponent(-20, -100)
    const entity2 = new Entity()
    entity2.addComponent('Position', position2)
    entity2.addComponent('Velocity', velocity2)
    this.world.addEntity(entity2)

    application.ticker.add((delta: number) => this.world.update(delta / 60))
  }
}
Main.init()
