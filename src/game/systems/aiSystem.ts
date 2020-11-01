import { System } from '@core/ecs/system'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'

export default class AISystem extends System {
  private family: Family

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('AI').build()
  }

  public update(): void {
    for (const entity of this.family.entityIterator) {
      const ai = entity.getComponent('AI')
      ai.execute()
    }
  }
}
