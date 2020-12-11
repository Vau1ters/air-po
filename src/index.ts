import { application, initializeApplication } from '@core/application'
import * as Art from '@core/graphics/art'
import * as Sound from '@core/sound/sound'
import { TitleWorldFactory } from '@game/worlds/titleWorldFactory'

export class Main {
  /*+.† INITIALIZATION †.+*/
  public static async init(): Promise<void> {
    initializeApplication()
    await Art.init()
    await Sound.init()
    const fonts = ((document as unknown) as { fonts: { load: (s: string) => void } }).fonts
    await fonts.load('24px myFont')

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
