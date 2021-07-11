import { World } from '@core/ecs/world'
import { BackgroundFactory } from '@game/entities/object/backgroundFactory'
import { assert } from '@utils/assertion'
import { getCustomProperty, ObjectLayer, TileSet } from './mapBuilder'

export const buildBackgroundLayer = (
  world: World,
  layer: ObjectLayer,
  tileSets: Array<TileSet>
): void => {
  const horizontalY = getCustomProperty<number | undefined>(layer, 'horizontalY')
  assert(horizontalY !== undefined, 'y coordinate of background should be set')

  for (const object of layer.objects) {
    world.addEntity(new BackgroundFactory(object, horizontalY, tileSets).create())
  }
}
