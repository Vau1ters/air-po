export class HPComponent {
  public constructor(private hp: number, private maxHp: number) {}

  decrease(damage: number): void {
    this.hp = Math.max(0, this.hp - damage)
  }

  get ratio(): number {
    return this.hp / this.maxHp
  }

  get isAlive(): boolean {
    return this.hp > 0
  }
}
