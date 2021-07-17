import * as t from 'io-ts'
import { World } from '@core/ecs/world'
import { EntityName } from '@game/entities/loader/EntityLoader'
import { assert } from '@utils/assertion'
import { Vec2 } from '@core/math/vec2'
import { objectList } from './objectList'
import { Stage } from './stage'

type ObjectName = keyof typeof objectList

const CustomPropertyType = t.type({
  name: t.string,
  type: t.string,
  value: t.union([t.boolean, t.number, t.string]),
})

const StageObjectType = t.type({
  gid: t.union([t.number, t.undefined]),
  height: t.number,
  id: t.number,
  name: t.string,
  properties: t.union([t.array(CustomPropertyType), t.undefined]),
  rotation: t.number,
  type: t.string,
  visible: t.boolean,
  width: t.number,
  x: t.number,
  y: t.number,
  ellipse: t.union([t.boolean, t.undefined]),
})
export type StageObject = t.TypeOf<typeof StageObjectType>

export const ObjectLayerType = t.type({
  draworder: t.literal('topdown'),
  id: t.number,
  name: t.string,
  objects: t.array(StageObjectType),
  opacity: t.number,
  type: t.literal('objectgroup'),
  visible: t.boolean,
  x: t.number,
  y: t.number,
})
export type ObjectLayer = t.TypeOf<typeof ObjectLayerType>

type PlayerSpawner = {
  id: number
  pos: Vec2
}

export const calcCenter = (object: StageObject): Vec2 => {
  const { x, y, width, height, ellipse } = object
  return new Vec2(x + width / 2, ellipse ? y + height / 2 : y - height / 2)
}

const buildSpawner = (object: StageObject): PlayerSpawner => {
  const id = object.properties?.find(prop => prop.name === 'id')?.value as number | undefined
  assert(id !== undefined, 'player spawner ID is not set')
  return {
    id,
    pos: calcCenter(object),
  }
}

export const buildObjectLayer = (layer: ObjectLayer, world: World, stage: Stage): void => {
  for (const object of layer.objects) {
    if (layer.name === 'player') {
      const { id, pos } = buildSpawner(object)
      stage.registerSpawner(id, pos)
    } else {
      const factory = objectList[layer.name as ObjectName]
      assert(factory !== undefined, `object name '${layer.name}' is invalid`)
      world.addEntity(new factory(layer.name as EntityName, object, world).create())
    }
  }
}
