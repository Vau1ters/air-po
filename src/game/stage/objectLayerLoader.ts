import * as t from 'io-ts'
import { World } from '@core/ecs/world'
import { toEntityName } from '@game/entities/loader/EntityLoader'
import { assert } from '@utils/assertion'
import { Vec2 } from '@core/math/vec2'
import { objectList } from './objectList'
import { Stage } from './stage'
import { CustomPropertyType } from './customProperty'
import { StageObject, StageObjectType, calcCenter } from './object'
import { TileSet } from './tileSet'

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

type PlayerSpawner = {
  id: number
  pos: Vec2
}

type Build = (stageObject: StageObject) => void
type Builder = { firstgid: number; build: Build }

export class ObjectLayerLoader {
  private builders: Array<Builder>

  constructor(private stage: Stage, private world: World, tileSets: Array<TileSet>) {
    this.builders = this.loadBuilders(tileSets)
  }

  public load(layer: ObjectLayer): void {
    const findBuilder = (gid: number): Builder => {
      for (let i = 0; i < this.builders.length; i++) {
        if (gid < this.builders[i].firstgid) continue
        if (i < this.builders.length - 1 && this.builders[i + 1].firstgid <= gid) continue
        return this.builders[i]
      }
      assert(false, `Could not find appropriate builder for gid ${gid}`)
    }

    for (const object of layer.objects) {
      assert(object.gid !== undefined, 'object.gid must not be undefined')
      const builder = findBuilder(object.gid)
      builder.build(object)
    }
  }

  private loadBuilders(tileSets: Array<TileSet>): Array<Builder> {
    const builders = new Array<Builder>()
    for (const { firstgid, source } of tileSets) {
      const { name } = require(`/res/stage/${source}`) // eslint-disable-line  @typescript-eslint/no-var-requires
      builders.push({
        firstgid,
        build: (stageObject: StageObject) => {
          if (name === 'player') {
            const { id, pos } = this.buildSpawner(stageObject)
            this.stage.registerSpawner(id, pos)
          } else {
            this.world.addEntity(
              new objectList[name as ObjectName](
                toEntityName(name),
                stageObject,
                stageObject.gid !== undefined ? stageObject.gid - firstgid : 0,
                this.world,
                this.stage
              ).create()
            )
          }
        },
      })
    }
    return builders
  }

  private buildSpawner(object: StageObject): PlayerSpawner {
    const id = object.properties?.find(prop => prop.name === 'id')?.value as number | undefined
    assert(id !== undefined, 'player spawner ID is not set')
    return {
      id,
      pos: calcCenter(object),
    }
  }
}
