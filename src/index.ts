import Renderer from './renderer'
import Entity from './entity'
import EntityManager from './entityManager'

class Main {
  /*.+† EntryPoint †+.*/
  static init(): void {
    Renderer.init()
    EntityManager.init()

    const testEntity = new Entity()
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
