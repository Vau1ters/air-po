import { World } from '@core/ecs/world'
import { ObjectLayer } from './objectLayerLoader'
import AirFactory from '@game/entities/stage/object/airFactory'

export const loadAirLayer = (layer: ObjectLayer, world: World): void => {
  for (const object of layer.objects) {
    world.addEntity(new AirFactory('air', object, world).create())
  }
}
