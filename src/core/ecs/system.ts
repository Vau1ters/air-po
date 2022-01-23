import { Process } from '@core/process/process'
import { ProcessDependency } from '@core/process/processDependency'
import { World } from './world'

const dependenciesMap = new Map<string, ProcessDependency>()
export function dependsOn(dependency: ProcessDependency) {
  return function (target: System, _: string, __: PropertyDescriptor): void {
    dependenciesMap.set(target.constructor.name, dependency)
  }
}

export abstract class System {
  protected readonly world: World
  public readonly updateProcess: Process
  public dependencies: string[] = []

  protected constructor(world: World) {
    this.world = world
    this.updateProcess = new Process({
      func: () => this.update(1 / 60),
      name: this.constructor.name + ':update',
      dependency: dependenciesMap.get(this.constructor.name),
    })
  }

  public init(): void {}
  public abstract update(delta: number): void
}
