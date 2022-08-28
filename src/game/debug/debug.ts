import { StagePointID } from '@game/components/stagePointComponent'
import { saveData, loadData, clearData } from '@game/playdata/playdata'
import { stageList } from '@game/stage/stageList.autogen'
import { StageName } from '@game/stage/stageLoader'
import DebugDrawSystem from '@game/systems/debugDrawSystem'
import { assert } from '@utils/assertion'

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

  const clearButton = document.getElementById('clearButton')
  assert(clearButton !== null, '')
  clearButton.onclick = () => {
    clearData()
    console.log('data cleared')
  }

  const mapSelector = document.getElementById('mapSelector') as HTMLSelectElement
  for (const stageName of Object.keys(stageList).map(s => s as StageName)) {
    const option = document.createElement('option')
    option.text = stageName
    option.value = stageName
    mapSelector.add(option)
  }
  mapSelector.onchange = () => {
    const stageName = mapSelector.value as StageName
    changeMap(stageName)
    console.log('stage changed: ', stageName)
  }
  mapSelector.value = loadData().spawnPoint.stageName

  const positionDrawCheckbox = document.getElementById('positionDrawCheckbox') as HTMLInputElement
  positionDrawCheckbox.onchange = () => {
    DebugDrawSystem.state.position = positionDrawCheckbox.checked
  }

  const colliderDrawCheckbox = document.getElementById('colliderDrawCheckbox') as HTMLInputElement
  colliderDrawCheckbox.onchange = () => {
    DebugDrawSystem.state.collider = colliderDrawCheckbox.checked
  }

  const bvhDrawCheckbox = document.getElementById('bvhDrawCheckbox') as HTMLInputElement
  bvhDrawCheckbox.onchange = () => {
    DebugDrawSystem.state.bvh = bvhDrawCheckbox.checked
  }
}
