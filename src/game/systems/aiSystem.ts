import { System } from '@core/ecs/system'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { Entity } from '@core/ecs/entity'

export default class AISystem extends System {
  private family: Family

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('Ai').build()

    this.family.entityAddedEvent.addObserver((entity: Entity) => {
      const ai = entity.getComponent('Ai')
      world.processManager.addProcess(ai.proc)
    })
    this.family.entityRemovedEvent.addObserver((entity: Entity) => {
      const ai = entity.getComponent('Ai')
      world.processManager.removeProcess(ai.proc)
    })
  }

  public update(): void {}
}
