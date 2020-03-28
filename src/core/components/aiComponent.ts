import { BehaviourTree } from '../ai/behaviourTree'
import { Entity } from '../ecs/entity'
import { World } from '../ecs/world'

export class AIComponent {
  private tree: BehaviourTree

  public constructor(tree: BehaviourTree) {
    this.tree = tree
  }

  public execute(entity: Entity, world: World): void {
    this.tree.execute(entity, world)
  }
}
