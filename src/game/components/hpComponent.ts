const DAMAGING_FRAMES = 5

type HpOption = {
  initial: number
  max: number
  showHpBar?: boolean
  canLock?: boolean
}

export class HpComponent {
  public damageTime = 0
  private _hp: number
  private _maxHp: number
  public readonly showHpBar: boolean
  public readonly canLock: boolean
  public constructor(option: HpOption) {
    this._hp = option.initial
    this._maxHp = option.max
    this.showHpBar = option.showHpBar ?? true
    this.canLock = option.canLock ?? true
  }

  decrease(damage: number): void {
    this._hp = Math.max(0, this.hp - damage)
    this.damageTime = DAMAGING_FRAMES
  }

  increase(heal: number): void {
    this._hp = Math.min(this.maxHp, this.hp + heal)
  }

  get ratio(): number {
    return this.hp / this.maxHp
  }

  get maxHp(): number {
    return this._maxHp
  }

  set maxHp(maxHp: number) {
    this._maxHp = maxHp
    this._hp = Math.min(this.maxHp, this.hp)
  }

  get hp(): number {
    return this._hp
  }
}
