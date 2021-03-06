import { System } from '@core/ecs/system'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'

export default class InvincibleSystem extends System {
  private family: Family

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('Invincible').build()
  }

  public update(delta: number): void {
    for (const entity of this.family.entityIterator) {
      const invincible = entity.getComponent('Invincible')
      invincible.decreaseTime(delta)
    }
  }
}
