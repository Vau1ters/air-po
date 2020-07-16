import { System } from '../ecs/system'
import { Family, FamilyBuilder } from '../ecs/family'
import { World } from '../ecs/world'
import { Entity } from '../ecs/entity'

export default class AISystem extends System {
  private family: Family

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('AI').build()
    this.family.entityAddedEvent.addObserver(entity => this.onEntityAdded(entity))
  }

  private onEntityAdded(entity: Entity): void {
    const ai = entity.getComponent('AI')
    ai.execute()
  }

  public update(): void {}
}
