const DAMAGING_FRAMES = 5

export class HpComponent {
  public damageTime = 0
  public constructor(private _hp: number, private _maxHp: number) {}

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

  get hp(): number {
    return this._hp
  }
}
