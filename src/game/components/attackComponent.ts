export class AttackComponent {
  public constructor(
    // 与えたいダメージ量
    public damage: number,
    // ダメージを与えたときにこのAttackComponentを所有するEntityがworldからremoveされるかどうか
    public shouldCounterbalance: boolean
  ) {}
}
