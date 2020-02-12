import Renderer from './renderer'
import Player from './Entity/player'
import EntityManager from './entityManager'
import { Vector2 } from './util'
import Input from './input'
import FrameCounter from './frameCounter'
import Art from './art'

class Main {
  /*.+† EntryPoint †+.*/
  static async init(): Promise<void> {
    await Art.init()
    Renderer.init()
    EntityManager.init()
    Input.init()

    const testEntity = new Player(new Vector2(250, 100))
    EntityManager.add(testEntity)

    this.update()
  }

  /*.+† MainLoop †+.*/
  static update(): void {
    EntityManager.update()
    FrameCounter.update()
    requestAnimationFrame(Main.update)
  }
}
Main.init()
