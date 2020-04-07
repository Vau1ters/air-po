import { World } from '../core/ecs/world'
import { WallFactory } from '../core/entities/wallFactory'
import { PositionComponent } from '../core/components/positionComponent'

export class MapBuilder {
  private world: World

  public constructor(world: World) {
    this.world = world
  }

  public build(map: any): void {
    const factory = new WallFactory()
    const wallTileSet = map.tilesets[0]

    for (let x = 0; x < map.width; x++) {
      for (let y = 0; y < map.height; y++) {
        const tileId = map.layers[0].data[x + y * map.width]
        if (tileId === 0) continue
        factory.id = tileId - wallTileSet.firstgid
        const wall = factory.create()
        const p = wall.getComponent('Position') as PositionComponent
        p.x = 8 * x
        p.y = 8 * y
        this.world.addEntity(wall)
      }
    }
  }
}
