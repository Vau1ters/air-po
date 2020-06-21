export class AirHolderComponent {
  private quantity: number
  private _maxQuantity: number
  private consumeSpeed: number
  private collectSpeed: number

  public constructor(airSetting: {
    initialQuantity: number
    maxQuantity: number
    consumeSpeed: number
    collectSpeed: number
  }) {
    this.quantity = airSetting.initialQuantity
    this._maxQuantity = airSetting.maxQuantity
    this.consumeSpeed = airSetting.consumeSpeed
    this.collectSpeed = airSetting.collectSpeed
  }

  public get currentQuantity(): number {
    return this.quantity
  }

  public get maxQuantity(): number {
    return this._maxQuantity
  }

  public consume(): void {
    this.quantity = Math.max(0, this.quantity - this.consumeSpeed)
  }

  public consumeBy(consumeSpeed: number): void {
    this.quantity = Math.max(0, this.quantity - consumeSpeed)
  }

  public collect(airQuantity: number): number {
    const prevQuantity = this.quantity
    this.quantity = Math.min(
      this._maxQuantity,
      this.quantity + this.collectSpeed,
      this.quantity + airQuantity
    )
    // 空気の消費量を返す
    return this.quantity - prevQuantity
  }
}
