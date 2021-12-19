import { Behaviour } from '@core/behaviour/behaviour'
import { sequent } from '@core/behaviour/sequence'
import { Entity } from '@core/ecs/entity'
import { Ui } from '@game/entities/ui/loader/uiLoader'
import { animate } from '../common/action/animate'

export const hudPlayerHpAI = function* (ui: Ui, player: Entity): Behaviour<void> {
  const hpHearts = ui.get('hpHearts').getComponent('TileLayout')
  const hp = player.getComponent('Hp')
  const renderingState: {
    hp: number
  } = {
    hp: 0,
  }

  const healingAnimation = function* (hpHeart: Entity, isLast: boolean): Behaviour<void> {
    yield* animate({ entity: hpHeart, state: 'Healing' })
    if (isLast) yield* animate({ entity: hpHeart, state: 'Sweat' })
    yield* animate({ entity: hpHeart, state: 'Full' })
  }
  const damagingAnimation = function* (hpHeart: Entity): Behaviour<void> {
    yield* animate({ entity: hpHeart, state: 'Damaging' })
    yield* animate({ entity: hpHeart, state: 'Empty' })
  }
  const animationDelay = 16

  while (true) {
    hpHearts.count = hp.maxHp

    if (renderingState.hp < hp.hp) {
      const changingHearts = hpHearts.entities.slice(renderingState.hp, hp.hp)
      const animations = changingHearts.map((hpHeart, index) =>
        healingAnimation(hpHeart, index === changingHearts.length - 1)
      )
      renderingState.hp = hp.hp
      yield* sequent(animations, animationDelay)
    }

    if (renderingState.hp > hp.hp) {
      const animations = hpHearts.entities
        .slice(hp.hp, renderingState.hp)
        .reverse()
        .map(hpHeart => damagingAnimation(hpHeart))
      renderingState.hp = hp.hp
      yield* sequent(animations, animationDelay)
    }

    yield
  }
}
