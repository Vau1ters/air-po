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

export type SaveData = {
  version: string
  storyStatus: StoryStatus
  spawnPoint: SpawnPoint
  playerData: PlayerData
}

export type PlayerData = {
  hp: number
  maxHp: number
  itemList: ItemName[]
  smallCoinCount: number
  acquiredLargeCoinList: Array<LargeCoinID>
  equipmentList: EquipmentStatus[]
}

export enum StoryStatus {
  Opening,
  Stage,
}

export const InitialSaveData: SaveData = {
  version: SaveDataVersion,
  storyStatus: StoryStatus.Opening,
  spawnPoint: {
    stageName: 'root',
    spawnerID: 0,
  },
  playerData: {
    hp: 3,
    maxHp: 3,
    itemList: ['testItem', 'testItem', 'hpHealItem', 'airHealItem'],
    smallCoinCount: 0,
    acquiredLargeCoinList: [],
    equipmentList: [],
  },
}

export const saveData = (data: SaveData): void => {
  localStorage.setItem('playdata', JSON.stringify(data))
}

export const loadData = (): SaveData => {
    const data = localStorage.getItem('playdata')
    if (data) {
      const result = JSON.parse(data) as SaveData
      if (result.version === SaveDataVersion) {
        return result
      }
    }

    saveData(InitialSaveData)
    return InitialSaveData
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
;(window as any).changeMap = (stageName: StageName, spawnerID: SpawnerID = 0): void => {
  saveData({ ...loadData(), spawnPoint: { stageName, spawnerID } })
}
