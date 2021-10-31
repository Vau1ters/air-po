import { Item } from './item'

export class HpHealItem extends Item {
  use(): void {
    const hp = this.player.getComponent('Hp')
    hp.increase(1)
  }

  canUse(): boolean {
    const hp = this.player.getComponent('Hp')
    return hp.hp < hp.maxHp
  }
}
