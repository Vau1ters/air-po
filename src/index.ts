import Renderer from './renderer'
import Entity from './entity'
import EntityManager from './entityManager'
import { Vector2 } from './util'

class Main {
  /*.+† EntryPoint †+.*/
  static init(): void {
    Renderer.init()
    EntityManager.init()

    const testEntity = new Entity(new Vector2(250, 100))
    EntityManager.add(testEntity)

    this.update()
  }

  /*.+† MainLoop †+.*/
  static update(): void {
    EntityManager.update()
    requestAnimationFrame(Main.update)
  }
}
Main.init()
