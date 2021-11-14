import { Equipment } from './equipment'

export class AirTank extends Equipment {
  private readonly QUANTITY = 400

  onEquip(): void {
    const airHolder = this.player.getComponent('AirHolder')
    airHolder.maxQuantity += this.QUANTITY
    airHolder.quantity = airHolder.maxQuantity
  }
}
