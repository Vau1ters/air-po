import { Equipment } from './equipment'

export class HpUp extends Equipment {
  onEquip(): void {
    const hp = this.player.getComponent('Hp')
    hp.maxHp += 1
    hp.increase(hp.maxHp - hp.hp)
  }
}
