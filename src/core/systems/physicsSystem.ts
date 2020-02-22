import { System } from '../ecs/system'
import { Family, FamilyBuilder } from '../ecs/family'
import { World } from '../ecs/world'
import { PositionComponent } from '../components/positionComponent'
import { VelocityComponent } from '../components/velocityComponent'

export default class PhysicsSystem extends System {
  private family: Family

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world)
      .include('Position', 'Velocity')
      .build()
  }

  public update(delta: number): void {
    for (const entity of this.family.entities) {
      const position = entity.getComponent('Position') as PositionComponent
      const velocity = entity.getComponent('Velocity') as VelocityComponent
      position.x += velocity.x * delta
      position.y += velocity.y * delta
    }
  }
}
