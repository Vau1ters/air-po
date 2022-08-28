export class AirComponent {
  public static readonly QUANTITY_RADIUS_RATE = 0.1
  private static readonly QUANTITY_ACTUALIZE_MIN_SPEED = 1
  private static readonly QUANTITY_ACTUALIZE_RATE = 0.5
  private _quantity: number
  private potentialQuantity: number

  public constructor(initialQuantity: number) {
    this._quantity = 0
    this.potentialQuantity = initialQuantity
  }

  public get quantity(): number {
    return this._quantity
  }

  public get radius(): number {
    return this._quantity * AirComponent.QUANTITY_RADIUS_RATE
  }

  public get alive(): boolean {
    return this.quantity > 0 || this.potentialQuantity > 0
  }

  public decrease(quantity: number): void {
    this.potentialQuantity -= Math.min(quantity, this.quantity + this.potentialQuantity)
  }

  public increase(quantity: number): void {
    this.potentialQuantity += quantity
  }

  public actualize(): void {
    const speed = Math.max(
      Math.abs(this.potentialQuantity) * AirComponent.QUANTITY_ACTUALIZE_RATE,
      AirComponent.QUANTITY_ACTUALIZE_MIN_SPEED
    )
    const delta =
      Math.sign(this.potentialQuantity) * Math.min(speed, Math.abs(this.potentialQuantity))
    this.potentialQuantity -= delta
    this._quantity += delta
  }
}
