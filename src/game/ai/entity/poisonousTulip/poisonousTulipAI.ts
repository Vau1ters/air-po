import { Behaviour } from '@core/behaviour/behaviour'
import { parallelAll } from '@core/behaviour/composite'
import { suspendable } from '@core/behaviour/suspendable'
import { wait } from '@core/behaviour/wait'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { PoisonFactory } from '@game/entities/poisonFactory'
import { getSingleton } from '@game/systems/singletonSystem'
import { emitAir } from '../common/action/emitAir'
import { kill } from '../common/action/kill'
import { isAlive } from '../common/condition/isAlive'

const emitPoison = (entity: Entity, world: World): void => {
  const position = entity.getComponent('Position')
  entity.getComponent('Sound').addSound('poison')

  for (let i = 0; i < 5; i++) {
    world.addEntity(
      new PoisonFactory(world)
        .setPosition(position.copy())
        .setDirection(new Vec2(Math.cos((Math.PI * i) / 4), -Math.sin((Math.PI * i) / 4)))
        .create()
    )
  }
}

const poisonousTulipDamaged = function*(entity: Entity, world: World): Behaviour<void> {
  let previousHp = entity.getComponent('Hp').hp

  while (true) {
    const currentHp = entity.getComponent('Hp').hp
    if (currentHp < previousHp) emitPoison(entity, world)
    previousHp = currentHp
    yield
  }
}

const poisonousTulipApproached = function*(entity: Entity, world: World): Behaviour<void> {
  const player = getSingleton('Player', world)

  while (true) {
    while (
      player
        .getComponent('Position')
        .sub(entity.getComponent('Position'))
        .length() < 48
    ) {
      emitPoison(entity, world)
      yield* wait.frame(90)
    }
    yield
  }
}

export const poisonousTulipAI = function*(entity: Entity, world: World): Behaviour<void> {
  yield* suspendable(
    isAlive(entity),
    parallelAll([poisonousTulipDamaged(entity, world), poisonousTulipApproached(entity, world)])
  )
  yield* emitAir(entity)
  yield* kill(entity, world)
}
