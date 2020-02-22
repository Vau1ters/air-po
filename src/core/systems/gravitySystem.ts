import { System } from '../ecs/system'
import { Family, FamilyBuilder } from '../ecs/family'
import { World } from '../ecs/world'
import { VelocityComponent } from '../components/velocityComponent'

export default class GravitySystem extends System {
  private family: Family
  private acceleration = 50

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('Velocity').build()
  }

  public update(delta: number): void {
    for (const entity of this.family.entities) {
      const velocity = entity.getComponent('Velocity') as VelocityComponent
      velocity.y += this.acceleration * delta
    }
  }
}
