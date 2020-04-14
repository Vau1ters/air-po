export class AirHolderComponent {
  private quantity: number
  private maxQuantity: number

  public constructor(airSetting: {
    initialQuantity: number
    maxQuantity: number
  }) {
    this.quantity = airSetting.initialQuantity
    this.maxQuantity = airSetting.maxQuantity
  }

  public get currentQuantity(): number {
    return this.quantity
  }

  public consume(quantity: number): void {
    this.quantity = Math.max(0, this.quantity - quantity)
  }

  public collect(quantity: number): void {
    this.quantity = Math.min(this.maxQuantity, this.quantity + quantity)
  }
}
