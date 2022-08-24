import { Equipment } from './equipment'

export class AirTank extends Equipment {
  public static readonly QUANTITY = 2 * 60

  onEquip(): void {
    const airHolder = this.player.getComponent('AirHolder')
    airHolder.maxQuantity += AirTank.QUANTITY
    airHolder.quantity = airHolder.maxQuantity
  }
}
