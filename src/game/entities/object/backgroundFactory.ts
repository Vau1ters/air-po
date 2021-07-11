import { Entity } from '@core/ecs/entity'
import { textureStore } from '@core/graphics/art'
import { Vec2 } from '@core/math/vec2'
import { DrawComponent } from '@game/components/drawComponent'
import { getCustomProperty, getTileSetDataFromGid, MapObject, TileSet } from '@game/map/mapBuilder'
import { TilingSprite } from 'pixi.js'
import { EntityFactory } from '../entityFactory'

type BackgroundLayer = 'CloseupView' | 'MiddleView' | 'DistantView'
const BACKGROUND_Z_INDEX = {
  CloseupView: -101,
  MiddleView: -102,
  DistantView: -103,
}
const BACKGROUND_SCROLL_SPEED = {
  CloseupView: new Vec2(0.7, 0.8),
  MiddleView: new Vec2(0.4, 0.5),
  DistantView: new Vec2(0.1, 0.1),
}

export class BackgroundFactory extends EntityFactory {
  public constructor(
    private mapObject: MapObject,
    private horizontalY: number,
    private tileSets: Array<TileSet>
  ) {
    super()
  }

  public create(): Entity {
    const bgType = getCustomProperty<BackgroundLayer>(this.mapObject, 'layer')
    const { name } = getTileSetDataFromGid(this.mapObject.gid, this.tileSets)

    const entity = new Entity()

    entity.addComponent('Background', {
      scrollSpeed: BACKGROUND_SCROLL_SPEED[bgType],
      horizontalY: this.horizontalY,
    })
    entity.addComponent('Position', new Vec2())
    const texture = textureStore[name][0]
    const sprite = new TilingSprite(texture, texture.width, texture.height)
    sprite.anchor.set(0.5)
    const drawComponent1 = new DrawComponent({
      entity: entity,
      child: {
        sprite: sprite,
      },
    })
    drawComponent1.zIndex = BACKGROUND_Z_INDEX[bgType]
    entity.addComponent('Draw', drawComponent1)

    return entity
  }
}
