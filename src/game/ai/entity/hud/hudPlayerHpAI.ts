import { Behaviour } from '@core/behaviour/behaviour'
import { sequent } from '@core/behaviour/sequence'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { assert } from '@utils/assertion'
import { animate } from '../common/action/animate'
import { UIComponentFactory } from '@game/entities/ui/uiComponentFactory'
import { getSingleton } from '@game/systems/singletonSystem'

const UI_SETTING = {
  HP: {
    x: 47,
    y: 22,
    shiftX: 10,
    animationDelay: 16,
  },
}

export const hudPlayerHpAI = function*(world: World): Behaviour<void> {
  const player = getSingleton('Player', world)
  const hp = player.getComponent('Hp')
  const renderingState: {
    entities: Entity[]
    hp: number
  } = {
    entities: [],
    hp: 0,
  }

  const healingAnimation = function*(hpHeart: Entity, isLast: boolean): Behaviour<void> {
    yield* animate({ entity: hpHeart, state: 'Healing' })
    if (isLast) yield* animate({ entity: hpHeart, state: 'Sweat' })
    yield* animate({ entity: hpHeart, state: 'Full' })
  }
  const damagingAnimation = function*(hpHeart: Entity): Behaviour<void> {
    yield* animate({ entity: hpHeart, state: 'Damaging' })
    yield* animate({ entity: hpHeart, state: 'Empty' })
  }

  while (true) {
    while (renderingState.entities.length < hp.maxHp) {
      const hpHeart = new UIComponentFactory('uiHpHeart')
        .setPosition(
          UI_SETTING.HP.x + renderingState.entities.length * UI_SETTING.HP.shiftX,
          UI_SETTING.HP.y
        )
        .create()
      renderingState.entities.push(hpHeart)
      world.addEntity(hpHeart)
    }
    while (renderingState.entities.length > hp.maxHp) {
      const lastHpHeart = renderingState.entities.pop()
      assert(lastHpHeart, `Tried to remove hp gauge but current maxHp is ${hp.maxHp}.`)
      world.removeEntity(lastHpHeart)
    }

    if (renderingState.hp < hp.hp) {
      const hpHearts = renderingState.entities.slice(renderingState.hp, hp.hp)
      const animations = hpHearts.map((hpHeart, index) =>
        healingAnimation(hpHeart, index === hpHearts.length - 1)
      )
      renderingState.hp = hp.hp
      yield* sequent(animations, UI_SETTING.HP.animationDelay)
    }

    if (renderingState.hp > hp.hp) {
      const animations = renderingState.entities
        .slice(hp.hp, renderingState.hp)
        .reverse()
        .map(hpHeart => damagingAnimation(hpHeart))
      renderingState.hp = hp.hp
      yield* sequent(animations, UI_SETTING.HP.animationDelay)
    }

    yield
  }
}
