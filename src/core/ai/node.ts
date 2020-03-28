import { World } from '../ecs/world'
import { Entity } from '../ecs/entity'

export interface Node {
  initState(): void
  execute(entity: Entity, world: World): NodeState
}

export enum NodeState {
  Failure,
  Success,
  Running,
}
