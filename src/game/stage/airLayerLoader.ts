import { World } from '@core/ecs/world'
import { ObjectLayer } from './objectLayerLoader'
import AirFactory from '@game/entities/stage/object/airFactory'
import { Stage } from './stage'

export const loadAirLayer = (layer: ObjectLayer, world: World, stage: Stage): void => {
  for (const object of layer.objects) {
    world.addEntity(new AirFactory('air', object, 0, world, stage).create())
  }
}
