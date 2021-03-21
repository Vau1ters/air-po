import { assert } from './assertion'

export class Process {
  constructor(private func: () => void, public name?: string, public dependencies?: string[]) {}

  execute(): void {
    this.func()
  }

  canExecute(finishedProcess: Process[]): boolean {
    return (
      this.dependencies?.every(name => finishedProcess.find(proc => proc.name === name)) ?? true
    )
  }
}

export class ProcessManager {
  private processList: Process[] = []

  public execute(): void {
    let remainedProcess = this.processList
    const finishedProcess: Process[] = []
    while (remainedProcess.length > 0) {
      const nextRemainedProcess: Process[] = []
      for (const proc of remainedProcess) {
        if (proc.canExecute(finishedProcess)) {
          proc.execute()
          finishedProcess.push(proc)
        } else {
          nextRemainedProcess.push(proc)
        }
      }
      if (remainedProcess.length === nextRemainedProcess.length) {
        const unresolvedProcess = remainedProcess
          .map(proc => proc.dependencies as string[])
          .reduce((a, b) => a.concat(b))
          .filter(name => !finishedProcess.find(proc => proc.name === name))
        assert(false, `unresolved dependencies: ${unresolvedProcess}`)
      }
      remainedProcess = nextRemainedProcess
    }
  }

  public addProcess(proc: Process): void {
    this.processList.push(proc)
  }

  public removeProcess(proc: Process): void {
    this.processList.splice(this.processList.indexOf(proc), 1)
  }
}
