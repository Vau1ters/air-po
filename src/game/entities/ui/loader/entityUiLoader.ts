import { Entity } from '@core/ecs/entity'
import { PositionComponent } from '@game/components/positionComponent'
import { loadEntity, toEntityName } from '@game/entities/loader/EntityLoader'
import { assert } from '@utils/assertion'
import * as t from 'io-ts'

export const EntityUiSettingType = t.type({
  type: t.literal('entity'),
  name: t.string,
  position: t.union([t.tuple([t.number, t.number]), t.undefined]),
})
type EntityUiSetting = t.TypeOf<typeof EntityUiSettingType>

export const loadEntityUi = (setting: EntityUiSetting): Entity => {
  const name = toEntityName(setting.name)
  const entity = loadEntity(name)
  if (setting.position) {
    assert(entity.hasComponent('Position') === false, '')
    entity.addComponent('Position', new PositionComponent(...setting.position))
  }
  return entity
}
