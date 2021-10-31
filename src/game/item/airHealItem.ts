import { Item } from './item'

export class AirHealItem extends Item {
  use(): void {
    const airHolder = this.player.getComponent('AirHolder')
    airHolder.collect(100)
  }

  canUse(): boolean {
    const airHolder = this.player.getComponent('AirHolder')
    return airHolder.quantity < airHolder.maxQuantity
  }
}
