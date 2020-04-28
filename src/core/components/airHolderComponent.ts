export class AirHolderComponent {
  private quantity: number
  private _maxQuantity: number

  public constructor(airSetting: {
    initialQuantity: number
    maxQuantity: number
  }) {
    this.quantity = airSetting.initialQuantity
    this._maxQuantity = airSetting.maxQuantity
  }

  public get currentQuantity(): number {
    return this.quantity
  }

  public get maxQuantity(): number {
    return this._maxQuantity
  }

  public consume(quantity: number): void {
    this.quantity = Math.max(0, this.quantity - quantity)
  }

  public collect(quantity: number): void {
    this.quantity = Math.min(this._maxQuantity, this.quantity + quantity)
  }
}
