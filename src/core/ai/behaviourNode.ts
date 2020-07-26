import { Entity } from '../ecs/entity'
import { World } from '../ecs/world'

export type ExecuteResult = 'Success' | 'Failure'

export type Behaviour = Generator<void, ExecuteResult>

export type BehaviourNode = (entity: Entity, world: World) => Behaviour
