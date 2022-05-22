import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { movieAI } from '@game/ai/entity/movie/movieAI'
import { AiComponent } from '@game/components/aiComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { Movie } from '@game/movie/movie'
import { Graphics } from 'pixi.js'
import { EntityFactory } from './entityFactory'

export class MovieFactory extends EntityFactory {
  constructor(private readonly movie: Movie, private readonly world: World) {
    super()
  }

  create(): Entity {
    const entity = new Entity()

    const g = new Graphics()
    g.position.set(0)

    entity.addComponent(
      'Draw',
      new DrawComponent({
        entity,
        child: {
          sprite: g,
        },
        type: 'UI',
      })
    )
    entity.addComponent('Position', new PositionComponent())
    entity.addComponent('Ai', new AiComponent(entity, movieAI(this.movie, g, this.world)))
    return entity
  }
}
