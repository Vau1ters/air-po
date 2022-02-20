import { Behaviour } from '@core/behaviour/behaviour'
import { parallelAll } from '@core/behaviour/composite'
import { Entity } from '@core/ecs/entity'
import { Ui } from '@game/entities/ui/loader/uiLoader'
import { GamingFilter } from '@game/filters/gamingFilter'
import { BitmapText } from 'pixi.js'
import { gamingAI } from '../coin/largeCoinAI'

const updateTextAI = function* (ui: Ui, player: Entity): Behaviour<void> {
  const [smallCoinText] = ui.get('coinCountSmall').getComponent('Draw').children as [BitmapText]
  const [largeCoinText] = ui.get('coinCountLarge').getComponent('Draw').children as [BitmapText]
  while (true) {
    smallCoinText.text = `${player.getComponent('Player').smallCoinCount}`
    largeCoinText.text = `${player.getComponent('Player').acquiredLargeCoinList.size}`
    yield
  }
}

const animationAI = function* (ui: Ui): Behaviour<void> {
  const coinLarge = ui.get('coinLarge')
  yield* gamingAI(coinLarge, new GamingFilter())
}

export const hudPlayerCoinAI = function* (ui: Ui, player: Entity): Behaviour<void> {
  yield* parallelAll([updateTextAI(ui, player), animationAI(ui)])
}
