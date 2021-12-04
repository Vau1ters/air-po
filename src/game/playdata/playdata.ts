import { StagePoint } from '@game/components/stagePointComponent'
import { EquipmentName } from '@game/equipment/equipment'
import { ItemName } from '@game/item/item'

export type LargeCoinID = number
export const SaveDataVersion = '0.0.1'

export type SaveData = {
  version: string
  storyStatus: StoryStatus
  spawnPoint: StagePoint
  playerData: PlayerData
}

export type PlayerData = {
  hp: number
  maxHp: number
  air: number
  itemList: ItemName[]
  smallCoinCount: number
  acquiredLargeCoinList: Array<LargeCoinID>
  equipmentList: EquipmentName[]
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
    pointID: 0,
  },
  playerData: {
    hp: 3,
    maxHp: 3,
    air: 1e8,
    itemList: ['testItem', 'testItem', 'hpHealItem', 'airHealItem'],
    smallCoinCount: 0,
    acquiredLargeCoinList: [],
    equipmentList: ['airTank', 'airTank'],
  },
}

export const clearData = (): void => {
  localStorage.clear()
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
