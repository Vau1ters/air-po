import { Entity } from '@core/ecs/entity'
import { equipmentURL } from './equipmentURL.autogen'

export type EquipmentName = keyof typeof equipmentURL

export abstract class Equipment {
  constructor(public readonly name: EquipmentName, protected player: Entity) {}
  abstract onEquip(): void
}
