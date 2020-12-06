export class HPComponent {
  public constructor(private _hp: number, private maxHp: number) {}

  decrease(damage: number): void {
    this._hp = Math.max(0, this.hp - damage)
  }

  get ratio(): number {
    return this.hp / this.maxHp
  }

  get hp(): number {
    return this._hp
  }
}
