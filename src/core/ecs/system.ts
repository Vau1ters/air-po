import { World } from './world'

export abstract class System {
  protected readonly world: World

  protected constructor(world: World) {
    this.world = world
  }

  public init(): void {}
  public abstract update(delta: number): void
}
