import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { textureStore } from '@core/graphics/art'
import { Vec2 } from '@core/math/vec2'
import { DrawComponent } from '@game/components/drawComponent'
import { HorizonComponent } from '@game/components/horizonComponent'
import { MapObject } from '@game/map/mapBuilder'
import { TilingSprite } from 'pixi.js'
import { EntityFactory } from '../entityFactory'
import { ObjectEntityFactory } from './objectEntityFactory'

type BackgroundLayer = 'CloseupView' | 'MiddleView' | 'DistantView'
const BACKGROUND_Z_INDEX = {
  CloseupView: -101,
  MiddleView: -102,
  DistantView: -103,
}

class BackgroundFactory extends EntityFactory {
  public constructor(
    private name: string,
    private layer: BackgroundLayer,
    private scrollSpeed: Vec2
  ) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()

    entity.addComponent('Background', { scrollSpeed: this.scrollSpeed })
    entity.addComponent('Position', new Vec2())
    const texture = textureStore[this.name][0]
    const sprite = new TilingSprite(texture, texture.width, texture.height)
    sprite.anchor.set(0.5)
    const drawComponent1 = new DrawComponent({
      entity: entity,
      child: {
        sprite: sprite,
      },
    })
    drawComponent1.zIndex = BACKGROUND_Z_INDEX[this.layer]
    entity.addComponent('Draw', drawComponent1)

    return entity
  }
}

class HorizonFactory extends ObjectEntityFactory {
  public constructor(object: MapObject, world: World) {
    super(
      'horizon entity',
      {
        ...object,
        width: 0,
        height: 0,
      },
      world
    )
  }

  public create(): Entity {
    const entity = super.create()
    entity.addComponent('Horizon', new HorizonComponent())

    return entity
  }
}

export const createBackground = (object: MapObject, world: World): void => {
  world.addEntity(new HorizonFactory(object, world).create())
  world.addEntity(new BackgroundFactory('background1', 'DistantView', new Vec2(0.1, 0.1)).create())
  world.addEntity(new BackgroundFactory('background2', 'CloseupView', new Vec2(0.7, 0.8)).create())
}
