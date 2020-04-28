export class AirComponent {
  private _quantity: number

  public constructor(initialQuantity: number) {
    this._quantity = initialQuantity
  }

  public get quantity(): number {
    return this._quantity
  }

  public decrease(quantity: number): void {
    this._quantity = Math.max(0, this._quantity - quantity)
  }

  public increase(quantity: number): void {
    this._quantity = this._quantity + quantity
  }
}
