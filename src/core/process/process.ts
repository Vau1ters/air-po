import { ProcessDependency } from './processDependency'

export type ProcessOption = {
  func: () => void
  name?: string
  dependency?: ProcessDependency
  tag?: Set<string>
}

export class Process {
  constructor(private readonly option: ProcessOption) {}

  private _isPausing = false

  execute(): void {
    if (this.isPausing) return
    this.option.func()
  }

  pause(): void {
    this._isPausing = true
  }

  resume(): void {
    this._isPausing = false
  }

  get isPausing(): boolean {
    return this._isPausing
  }

  get name(): string {
    return this.option.name ?? ''
  }

  get dependency(): ProcessDependency {
    return this.option.dependency ?? {}
  }

  get tag(): Set<string> | undefined {
    return this.option.tag
  }
}
