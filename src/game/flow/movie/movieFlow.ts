import { Behaviour } from '@core/behaviour/behaviour'
import { suspendable } from '@core/behaviour/suspendable'
import { Entity } from '@core/ecs/entity'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { MovieFactory } from '@game/entities/movieFactory'
import { Movie } from '@game/movie/movie'
import { assert } from '@utils/assertion'
import { Container } from 'pixi.js'

const findEntity = (nameFamily: Family, name: string): Entity => {
  const entity = nameFamily.entityArray.find(e => e.getComponent('Name').name === name)
  assert(entity, `Entity '${name}' is not found`)
  return entity
}

export const movieFlow = function* (gameWorld: World, movie: Movie): Behaviour<void> {
  const nameFamily = new FamilyBuilder(gameWorld).include('Name').build()
  const laserSight = findEntity(nameFamily, 'LaserSight')
  const [laserSightGraphics] = laserSight.getComponent('Draw').children
  const uiContainer = gameWorld.stage.getChildByName('uiContainer', true) as Container
  const procs = gameWorld.processManager.processes.filter(p => p.tag?.has('AI'))
  const movieEntity = new MovieFactory(movie, gameWorld).create()

  procs.forEach(p => p.pause())
  const ui = uiContainer.removeChildren()
  gameWorld.addEntity(movieEntity)
  laserSightGraphics.visible = false

  yield* suspendable(() => movieEntity.getComponent('Ai').isAlive, gameWorld.execute())

  procs.forEach(p => p.resume())
  ui.forEach(ui => uiContainer.addChild(ui))
  gameWorld.removeEntity(movieEntity)
  laserSightGraphics.visible = true
}
