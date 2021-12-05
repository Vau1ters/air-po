import * as t from 'io-ts'
import { World } from '@core/ecs/world'
import { toEntityName } from '@game/entities/loader/EntityLoader'
import { assert } from '@utils/assertion'
import { objectList } from './objectList'
import { CustomPropertyType } from './customProperty'
import { TileSet } from './tileSet'
import { Entity } from '@core/ecs/entity'
import { StageObjectType } from './object'
import { StageName } from './stageLoader'

type ObjectName = keyof typeof objectList

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
  properties: t.union([t.array(CustomPropertyType), t.undefined]),
})

export type ObjectLayer = t.TypeOf<typeof ObjectLayerType>

export const createObjectLayerLoader = (
  world: World,
  tileSets: Array<TileSet>,
  stageName: StageName
): ((layer: ObjectLayer) => Generator<Entity>) => {
  type Builder = { firstgid: number; name: ObjectName }
  const builders = new Array<Builder>()
  for (const { firstgid, source } of tileSets) {
    const { name } = require(`/res/stage/${source}`) // eslint-disable-line  @typescript-eslint/no-var-requires
    builders.push({
      firstgid,
      name,
    })
  }
  builders.sort((a, b) => b.firstgid - a.firstgid)
  return function*(layer: ObjectLayer): Generator<Entity> {
    for (const object of layer.objects) {
      const gid = object.gid
      assert(gid !== undefined, 'object.gid must not be undefined')
      const builder = builders.find((builder: Builder): boolean => builder.firstgid <= gid)
      assert(builder !== undefined, `Could not find appropriate builder for gid ${object.gid}`)
      const { firstgid, name } = builder
      const objectClass = objectList[name as ObjectName]
      const frame = gid - firstgid
      yield new objectClass(toEntityName(name), object, frame, world, stageName).create()
    }
  }
}
