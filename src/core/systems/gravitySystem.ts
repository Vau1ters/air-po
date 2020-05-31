import { System } from '../ecs/system'
import { Family, FamilyBuilder } from '../ecs/family'
import { World } from '../ecs/world'
import { RigidBodyComponent } from '../components/rigidBodyComponent'

export default class GravitySystem extends System {
  private family: Family
  private acceleration = 800

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('RigidBody').build()
  }

  public update(delta: number): void {
    for (const entity of this.family.entityIterator) {
      const body = entity.getComponent('RigidBody') as RigidBodyComponent
      body.velocity.y += this.acceleration * body.gravityScale * delta
    }
  }
}
