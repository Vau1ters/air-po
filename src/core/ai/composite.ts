import { Node, NodeState } from './node'
import { World } from '../ecs/world'
import { Entity } from '../ecs/entity'

export abstract class Composite implements Node {
  protected children = new Array<Node>()

  public addChild(node: Node): void {
    this.children.push(node)
  }

  abstract initState(): void
  abstract execute(entity: Entity, World: World): NodeState
}
