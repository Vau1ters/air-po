import { application, initializeApplication } from './core/application'
import * as Art from './core/graphics/art'
import { TitleWorldFactory } from './core/worlds/titleWorldFactory'

export class Main {
  /*+.† INITIALIZATION †.+*/
  public static async init(): Promise<void> {
    initializeApplication()
    await Art.init()

    const world = new TitleWorldFactory().create()
    world.start()

    /* eslint @typescript-eslint/no-var-requires: 0 */
    const Stats = require('stats.js')

    const stats = new Stats()
    stats.showPanel(1) // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom)

    application.ticker.add(() => stats.update())
  }
}
Main.init()
