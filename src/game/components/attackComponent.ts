import { Entity } from '../../core/ecs/entity'

export class AttackComponent {
  public constructor(
    // 与えたいダメージ量
    public damage: number,
    // 攻撃元
    public entity: Entity
  ) {}
}
