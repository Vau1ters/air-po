export class AttackComponent {
  public constructor(
    // 与えたいダメージ量
    public damage: number,
    // ダメージを与えたときに死ぬかどうか
    public shouldCounterbalance: boolean
  ) {}
}
