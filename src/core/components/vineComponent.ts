import { Entity } from '../ecs/entity'

export class VineComponent {
  public child: Entity | undefined
  public canExtend = false
  public shouldShrink = false
  public constructor(public parent: Entity | undefined, public length: number) {}
}
