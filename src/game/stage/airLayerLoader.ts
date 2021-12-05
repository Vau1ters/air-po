import { ObjectLayer } from './objectLayerLoader'
import AirFactory from '@game/entities/stage/object/airFactory'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { StageName } from './stageLoader'

export const createAirLayerLoader = (
  world: World,
  stageName: StageName
): ((layer: ObjectLayer) => Generator<Entity>) => {
  return function*(layer: ObjectLayer): Generator<Entity> {
    for (const object of layer.objects) {
      yield new AirFactory('air', object, 0, world, stageName).create()
    }
  }
}
