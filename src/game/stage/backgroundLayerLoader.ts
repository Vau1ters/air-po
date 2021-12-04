import { BackgroundFactory } from '@game/entities/backgroundFactory'
import { assert } from '@utils/assertion'
import { ObjectLayer } from './objectLayerLoader'
import { TileSet } from './tileSet'
import { Entity } from '@core/ecs/entity'
import { findCustomProperty } from './customProperty'

export const createBackgroundLayerLoader = (
  tileSets: Array<TileSet>
): ((layer: ObjectLayer) => Generator<Entity>) => {
  return function*(layer: ObjectLayer): Generator<Entity> {
    const horizontalY = findCustomProperty(layer, 'float', 'horizontalY')
    assert(horizontalY !== undefined, 'y coordinate of background is not set')

    for (const object of layer.objects) {
      yield new BackgroundFactory(object, horizontalY, tileSets).create()
    }
  }
}
