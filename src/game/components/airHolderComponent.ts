import { Entity } from '@core/ecs/entity'

export type AirHolderSetting = {
  initialQuantity: number
  maxQuantity: number
  consumeSpeed: number
  collectSpeed: number
  shouldDamageInSuffocation: boolean
}

export class AirHolderComponent {
  public quantity: number
  public maxQuantity: number
  private consumeSpeed: number
  public collectSpeed: number
  public emitSpeed: number
  public readonly shouldDamageInSuffocation: boolean
  public suffocationDamageCount: number
  public inAir: boolean
  public hitAirs: Array<Entity> = []

  public constructor(airSetting: AirHolderSetting) {
    this.quantity = airSetting.initialQuantity
    this.maxQuantity = airSetting.maxQuantity
    this.consumeSpeed = airSetting.consumeSpeed
    this.collectSpeed = airSetting.collectSpeed
    this.emitSpeed = 0
    this.shouldDamageInSuffocation = airSetting.shouldDamageInSuffocation
    this.suffocationDamageCount = 0
    this.inAir = false
  }

  public consume(): void {
    this.quantity = Math.max(0, this.quantity - this.consumeSpeed)
  }

  public consumeBy(consumeSpeed: number): number {
    const prevQuantity = this.quantity
    this.quantity = Math.max(0, this.quantity - consumeSpeed)
    return prevQuantity - this.quantity
  }

  public collect(airQuantity: number): number {
    const prevQuantity = this.quantity
    this.quantity = Math.min(
      this.maxQuantity,
      this.quantity + this.collectSpeed,
      this.quantity + airQuantity
    )
    this.inAir = true
    // 空気の消費量を返す
    return this.quantity - prevQuantity
  }
}
