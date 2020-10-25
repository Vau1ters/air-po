import { System } from '../system'
import { Family, FamilyBuilder } from '../family'
import { World } from '../world'

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
