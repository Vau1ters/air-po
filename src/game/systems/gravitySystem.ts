import { System } from '@core/ecs/system'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'

export default class GravitySystem extends System {
  private family: Family
  public static readonly acceleration = 600

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('RigidBody').build()
  }

  public update(): void {
    for (const entity of this.family.entityIterator) {
      const body = entity.getComponent('RigidBody')
      body.acceleration.y += GravitySystem.acceleration * body.gravityScale
    }
  }
}
