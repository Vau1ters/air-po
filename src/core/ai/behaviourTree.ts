import { Entity } from '../ecs/entity'
import { World } from '../ecs/world'
import { Node, NodeState } from './node'

export class BehaviourTree {
  private root: Node
  private currentState: NodeState

  public constructor(root: Node) {
    this.currentState = NodeState.Running
    this.root = root
  }

  // Entityに必要なComponentのValidationとかやりたい
  // 各Nodeは必要なComponentのListを用意して、初回実行時に再帰的に必要なComponentを保持しているか調べる
  public execute(entity: Entity, world: World): void {
    if (this.currentState === NodeState.Running) {
      this.currentState = this.root.execute(entity, world)
    }
  }
}
