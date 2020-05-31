import { System } from '../ecs/system'
import { Family, FamilyBuilder } from '../ecs/family'
import { World } from '../ecs/world'
import { InvincibleComponent } from '../components/invincibleComponent'

export default class InvincibleSystem extends System {
  private family: Family

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('Invincible').build()
  }

  public update(delta: number): void {
    for (const entity of this.family.entityIterator) {
      const invincible = entity.getComponent(
        'Invincible'
      ) as InvincibleComponent
      invincible.decreaseTime(delta)
    }
  }
}
