import { SpawnPoint } from '@game/components/gameEventComponent'
import { ItemName } from '@game/flow/inventory/item'
import { SpawnerID } from '@game/stage/stage'
import { StageName } from '@game/stage/stageLoader'

export type LargeCoinID = number
export type EquipmentStatus = {
  name: string
  level: number
}
export const SaveDataVersion = '0.0.1'

export type PlayData = {
  version: string
  storyStatus: StoryStatus
  itemList: ItemName[]
  smallCoinCount: number
  acquiredLargeCoinList: Array<LargeCoinID>
  equipmentList: EquipmentStatus[]
  spawnPoint: SpawnPoint
}

export enum StoryStatus {
  Opening,
  Stage,
}

export const InitialPlayData: PlayData = {
  version: SaveDataVersion,
  storyStatus: StoryStatus.Opening,
  itemList: ['testItem', 'testItem', 'hpHealItem', 'airHealItem'],
  smallCoinCount: 0,
  acquiredLargeCoinList: [],
  equipmentList: [],
  spawnPoint: {
    stageName: 'root',
    spawnerID: 0,
  },
}

export const savePlayData = (data: PlayData): void => {
  localStorage.setItem('playdata', JSON.stringify(data))
}

export const loadPlayData = (): PlayData => {
    const data = localStorage.getItem('playdata')
    if (data) {
      const result = JSON.parse(data) as PlayData
      if (result.version === SaveDataVersion) {
        return result
      }
    }

    savePlayData(InitialPlayData)
    return InitialPlayData
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
;(window as any).changeMap = (stageName: StageName, spawnerID: SpawnerID = 0): void => {
  savePlayData({ ...loadPlayData(), spawnPoint: { stageName, spawnerID } })
}
