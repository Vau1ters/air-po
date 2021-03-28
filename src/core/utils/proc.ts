import { assert } from './assertion'

export type Dependency = {
  before?: string[]
  after?: string[]
}

export class Process {
  constructor(private func: () => void, public name?: string, public dependency: Dependency = {}) {}

  execute(): void {
    this.func()
  }
}

export class ProcessManager {
  private processList: Process[] = []

  public execute(): void {
    for (const proc of this.processList) {
      proc.execute()
    }
  }

  public addProcess(proc: Process): void {
    this.processList.push(proc)
    this.updateProcessList()
  }

  public removeProcess(proc: Process): void {
    this.processList.splice(this.processList.indexOf(proc), 1)
    this.updateProcessList()
  }

  private updateProcessList(): void {
    const dependencyMap = new Map<Process, Process[]>() // key depends on value(key must be executed after value)
    for (const proc of this.processList) {
      dependencyMap.set(proc, [])
    }
    for (const proc of this.processList) {
      for (const name2 of proc.dependency.before ?? []) {
        const proc2 = this.processList.find(proc2 => proc2.name === name2)
        assert(proc2, `undefined process name: ${name2}`)
        // proc must be executed before proc2
        dependencyMap.get(proc2)?.push(proc)
      }
      for (const name2 of proc.dependency.after ?? []) {
        const proc2 = this.processList.find(proc2 => proc2.name === name2)
        assert(proc2, `undefined process name: ${name2}`)
        // proc must be executed after proc2
        dependencyMap.get(proc)?.push(proc2)
      }
    }
    // TODO: detect circuic reference
    let remainingProcessList = this.processList
    const newProcessList: Process[] = []
    while (remainingProcessList.length > 0) {
      const nextRemainingProcessList = remainingProcessList.filter(proc => {
        if (dependencyMap.get(proc)?.every(proc2 => newProcessList.includes(proc2))) {
          newProcessList.push(proc)
          return false
        }
        return true
      })
      assert(
        nextRemainingProcessList.length < remainingProcessList.length,
        `cannot resolve dependency: ${remainingProcessList.map(proc => proc.name)}`
      )
      remainingProcessList = nextRemainingProcessList
    }
    this.processList = newProcessList

    for (const proc of this.processList) {
      for (const name2 of proc.dependency.before ?? []) {
        assert(
          this.processList.findIndex(p => p === proc) <
            this.processList.findIndex(p => p.name === name2),
          `${proc.name} must be before ${name2}`
        )
      }
      for (const name2 of proc.dependency.after ?? []) {
        assert(
          this.processList.findIndex(p => p === proc) >
            this.processList.findIndex(p => p.name === name2),
          `${proc.name} must be after ${name2}`
        )
      }
    }
  }
}
