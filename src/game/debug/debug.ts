import { StagePointID } from '@game/components/stagePointComponent'
import { saveData, loadData, clearData } from '@game/playdata/playdata'
import { StageName } from '@game/stage/stageLoader'
import DebugDrawSystem from '@game/systems/debugDrawSystem'

const changeMap = (stageName: StageName, pointID: StagePointID = 0): void => {
  saveData({ ...loadData(), spawnPoint: { stageName, pointID } })
}

const DebugUtility = {
  clearData,
  changeMap,
  debugDrawState: DebugDrawSystem.state,
}

export const exportDebugUtilityToGlobal = (): void => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = window as any
  for (const key of Object.keys(DebugUtility) as Array<keyof typeof DebugUtility>) {
    global[key] = DebugUtility[key]
  }
}
