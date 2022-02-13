import { application, initializeApplication } from '@core/application'
import * as Art from '@core/graphics/art'
import * as Sound from '@core/sound/sound'
import * as Font from '@core/font/font'
import { totalFlow } from '@game/flow/flow'
import { exportDebugUtilityToGlobal } from '@game/debug/debug'
import { loadData } from '@game/playdata/playdata'

export class Main {
  /*+.† INITIALIZATION †.+*/
  public static async init(): Promise<void> {
    initializeApplication()
    await Art.init()
    await Sound.init()
    Font.init()
    exportDebugUtilityToGlobal()

    Sound.setMasterVolume(loadData().masterVolume)

    const flow = totalFlow()
    application.ticker.add(() => {
      flow.next()
    })

    /* eslint @typescript-eslint/no-var-requires: 0 */
    const Stats = require('stats.js')

    const stats = new Stats()
    stats.showPanel(1) // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom)

    application.ticker.add(() => stats.update())
  }
}
Main.init()
