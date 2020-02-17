import { World } from './core/ecs/world'
import { PositionComponent } from './core/components/positionComponent'
import { VelocityComponent } from './core/components/velocityComponent'
import { Entity } from './core/ecs/entity'
import DrawSystem from './core/systems/drawSystem'
import Graphics from './core/graphics'
import PhysicsSystem from './core/systems/phisicsSystem'
import GravitySystem from './core/systems/gravitySystem'

export class Main {
  public static world = new World()
  /*+.† INITIALIZATION †.+*/
  public static init(): void {
    Graphics.init()
    this.world.addSystem(
      new PhysicsSystem(this.world),
      new GravitySystem(this.world),
      new DrawSystem(this.world)
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
  }
}
Main.init()
