import { Behaviour } from '@core/behaviour/behaviour'
import { Entity } from '@core/ecs/entity'
import { Ui } from '@game/entities/ui/loader/uiLoader'
import { BitmapText } from 'pixi.js'

export const hudPlayerCoinAI = function* (ui: Ui, player: Entity): Behaviour<void> {
  const [smallCoinText] = ui.get('coinCountSmall').getComponent('Draw').children as [BitmapText]
  const [largeCoinText] = ui.get('coinCountLarge').getComponent('Draw').children as [BitmapText]
  while (true) {
    smallCoinText.text = `${player.getComponent('Player').smallCoinCount}`
    largeCoinText.text = `${player.getComponent('Player').acquiredLargeCoinList.size}`
    yield
  }
}
