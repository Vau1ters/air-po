import { BehaviourNode, NodeState } from '../behaviourNode'
import { World } from '../../ecs/world'
import { Entity } from '../../ecs/entity'
import { VineFactory } from '../../entities/vineFactory'
import { Collider } from '../../components/colliderComponent'

export class ExtendVineNode implements BehaviourNode {
  private factory = new VineFactory()
  public constructor(vine: Entity) {
    for (const collider of vine.getComponent('Collider').colliders) {
      if (collider.tag.has('vineSensor')) {
        collider.callbacks.add(ExtendVineNode.canExtend)
      }
    }
  }

  public initState(): void {
    // 何もしない
  }

  public execute(entity: Entity, world: World): NodeState {
    const vine = entity.getComponent('Vine')

    if (vine.canExtend && vine.child == undefined) {
      this.factory.parent = entity
      const childVine = this.factory.create()
      const childPosition = childVine.getComponent('Position')
      const position = entity.getComponent('Position')
      childPosition.x = position.x
      childPosition.y = position.y + 16
      world.addEntity(childVine)
    }

    vine.canExtend = true
    return NodeState.Success
  }

  public static canExtend(me: Collider, other: Collider): void {
    if (!other.isSensor) {
      const vine = me.component.entity.getComponent('Vine')
      vine.canExtend = false
    }
  }
}
