import { Entity } from '../ecs/entity'

export class PlayerPointerComponent {
  public constructor(public player?: Entity) {}
}
