import { Entity } from '../../ecs/entity'
import { World } from '../../ecs/world'
import { Node, NodeState } from '../node'

export class SequenceNode extends Node {
  private current = 0

  public constructor(protected children: Array<Node> = []) {
    super()
  }

  public addChild(node: Node): void {
    this.children.push(node)
  }

  public initState(): void {
    this.current = 0
    this.children.forEach(node => node.initState())
  }

  public execute(entity: Entity, world: World): NodeState {
    if (this.children.length <= this.current) {
      throw 'call already successed sequence node.'
    }

    let state = this.children[this.current].execute(entity, world)
    while (state === NodeState.Success) {
      this.current++
      if (this.current >= this.children.length) {
        return NodeState.Success
      }

      state = this.children[this.current].execute(entity, world)
    }
    return state
  }
}
