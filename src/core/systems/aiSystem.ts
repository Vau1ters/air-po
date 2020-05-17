import { System } from '../ecs/system'
import { Family, FamilyBuilder } from '../ecs/family'
import { World } from '../ecs/world'
import { AIComponent } from '../components/aiComponent'

export default class AISystem extends System {
  private family: Family

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('AI').build()
  }

  public update(): void {
    for (const entity of this.family.entities) {
      const ai = entity.getComponent('AI') as AIComponent
      ai.execute(entity, this.world)
    }
  }
}
