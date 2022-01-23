import { Item } from './item'
import * as Sound from '@core/sound/sound'

export class HpHealItem extends Item {
  use(): void {
    const hp = this.player.getComponent('Hp')
    hp.increase(1)
    Sound.play('hpHeal')
  }

  canUse(): boolean {
    const hp = this.player.getComponent('Hp')
    return hp.hp < hp.maxHp
  }
}
