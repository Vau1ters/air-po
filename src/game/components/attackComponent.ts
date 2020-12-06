import { Entity } from '@core/ecs/entity'

export class AttackComponent {
  public constructor(
    // 与えたいダメージ量
    public damage: number,
    // ダメージを与えたときに死ぬかどうか
    public shouldCounterbalance: boolean,
    // ダメージを与えないEntity
    public ignoreList: Array<Entity> = []
  ) {}
}
