import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'

export const wait = function*(boss: Entity, world: World): Behaviour<void> {}
