import { Behaviour } from '@core/behaviour/behaviour'
import { FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { Movie } from '@game/movie/movie'
import { Graphics } from 'pixi.js'
import { blackActionAI } from './blackActionAI'
import { cameraActionAI } from './cameraActionAI'
import { cinemaScopeActionAI } from './cinemaScopeActionAI'
import { moveActionAI } from './moveActionAI'
import { showSpriteActionAI } from './showSpriteActionAI'
import { talkActionAI } from './talkActionAI'

export const movieAI = function* (movie: Movie, g: Graphics, world: World): Behaviour<void> {
  const nameFamily = new FamilyBuilder(world).include('Name').build()
  for (const action of movie) {
    switch (action.action) {
      case 'black':
        yield* blackActionAI(action, g)
        break
      case 'cinemaScope':
        yield* cinemaScopeActionAI(action, g)
        break
      case 'camera':
        yield* cameraActionAI(action, world, nameFamily)
        break
      case 'talk':
        yield* talkActionAI(action, world, nameFamily)
        break
      case 'move':
        yield* moveActionAI(action, nameFamily)
        break
      case 'showSprite':
        yield* showSpriteActionAI(action, world, nameFamily)
        break
    }
  }
}
