import { Behaviour } from '@core/behaviour/behaviour'
import { suspendable } from '@core/behaviour/suspendable'
import { wait } from '@core/behaviour/wait'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { getSingleton } from '@game/systems/singletonSystem'
import { animate } from '../common/action/animate'
import { isAlive } from '../common/condition/isAlive'
import { fluffAI } from './fluff/fluffAI'
import { normalAI } from './normal/normalAI'

export const FLUFF_TAG = 'Fluff'
export const PLAYER_SETTING = {
  normal: {
    throughFloor: {
      ignoreCount: 20,
    },
    jet: {
      airConsumeSpeed: 0.1,
      speed: 140,
      power: 600,
      coolTime: 10,
    },
    jump: {
      speed: 280,
    },
    walk: {
      power: 10,
      speed: 100,
    },
  },
  fluff: {
    chase: {
      grabPosition: new Vec2(0, 7.0),
      chaseScale: 0.5,
    },
    release: {
      distance: 10,
    },
    move: {
      speed: 0.3,
    },
  },
}

type PlayerMode = 'Normal' | 'Fluff'

const getCurrentPlayerMode = (entity: Entity): PlayerMode => {
  const player = entity.getComponent('Player')
  if (player.possessingEntity !== undefined) {
    if (player.possessingEntity.getComponent('Collider').colliders[0].tag.has(FLUFF_TAG)) {
      return 'Fluff'
    }
  }
  return 'Normal'
}

const selectPlayerAI = (entity: Entity, world: World): Behaviour<void> => {
  switch (getCurrentPlayerMode(entity)) {
    case 'Normal':
      return normalAI(entity, world)
    case 'Fluff':
      return fluffAI(entity, world)
  }
}

const playerControl = function* (entity: Entity, world: World): Behaviour<void> {
  while (true) {
    const mode = getCurrentPlayerMode(entity)
    yield* suspendable(() => mode === getCurrentPlayerMode(entity), selectPlayerAI(entity, world))
  }
}

export const playerAI = function* (entity: Entity, world: World): Behaviour<void> {
  yield* suspendable(isAlive(entity), playerControl(entity, world))
  yield* animate({ entity, state: 'Dying' })
  yield* wait.frame(60)
  getSingleton('GameEvent', world).getComponent('GameEvent').event = {
    type: 'playerDie',
  }
}
