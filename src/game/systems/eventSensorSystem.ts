import { CollisionCallbackArgs } from '@game/components/colliderComponent'
import { Entity } from '@core/ecs/entity'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { System } from '@core/ecs/system'
import { World } from '@core/ecs/world'
import { PLAYER_SENSOR_TAG } from '@game/entities/playerFactory'
import { StageName } from '@game/stage/stageLoader'
import { getSingleton } from './singletonSystem'
import { StagePoint } from '@game/components/stagePointComponent'
import { Movie, MovieName, MovieType } from '@game/movie/movie'
import { GameEvent } from '@game/components/gameEventComponent'
import { movieList } from '@game/movie/movieList.autogen'
import { decodeJson } from '@utils/json'

export class EventSensorSystem extends System {
  private sensorFamily: Family

  constructor(world: World) {
    super(world)
    this.sensorFamily = new FamilyBuilder(world).include('Sensor').build()
    this.sensorFamily.entityAddedEvent.addObserver((e: Entity) => this.onSensorAdded(e))
  }

  public update(): void {}

  private onSensorAdded(entity: Entity): void {
    const sensor = entity.getComponent('Sensor')
    for (const c of entity.getComponent('Collider').colliders) {
      c.notifier.addObserver(async (args: CollisionCallbackArgs) => {
        if (!args.other.tag.has(PLAYER_SENSOR_TAG)) return
        if (!sensor.isEnabled) return
        await this.fireEvent(sensor.event, args.me.entity)
        sensor.isEnabled = false
      })
    }
  }

  private async fireEvent(event: string, sensor: Entity): Promise<void> {
    const [eventName, ...options] = event.split(' ')
    switch (eventName) {
      case 'changeMap': {
        const stageName = options[0] as StageName
        const pointID = Number(options[1])
        await this.moveEvent({ stageName, pointID })
        break
      }
      case 'movie': {
        const movieName = options[0] as MovieName
        await this.movieEvent(movieName, sensor)
        break
      }
    }
  }

  private moveEvent(spawnPoint: StagePoint): void {
    this.postEvent({
      type: 'move',
      spawnPoint,
    })
  }

  private movieEvent(movieName: MovieName, sensor: Entity): void {
    this.postEvent({
      type: 'movie',
      movie: decodeJson<Movie>(movieList[movieName], MovieType),
      sensor,
    })
  }

  private postEvent(event: GameEvent): void {
    getSingleton('GameEvent', this.world).getComponent('GameEvent').event = event
  }
}
