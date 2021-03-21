import { Process } from '@utils/proc'
import { World } from './world'

const dependenciesMap = new Map<string, string[]>()
export function dependsOn(...dependencies: string[]) {
  return function(target: System, _: string, __: PropertyDescriptor): void {
    dependenciesMap.set(target.constructor.name, dependencies)
  }
}

export abstract class System {
  protected readonly world: World
  public readonly updateProcess: Process
  public dependencies: string[] = []

  protected constructor(world: World) {
    this.world = world
    this.updateProcess = new Process(
      () => this.update(1 / 60),
      this.constructor.name + ':update',
      dependenciesMap.get(this.constructor.name)
    )
  }

  public init(): void {}
  public abstract update(delta: number): void
}
