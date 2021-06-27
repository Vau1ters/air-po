/*+.† NOTIFICATION †.+*/
// this file is automatically written by soundtool.
// you can update this file by type "yarn soundtool" command.

// IMPORT
import start from '@res/sound/start.ogg'
import snibeeDie from '@res/sound/snibeeDie.ogg'
import snibee from '@res/sound/snibee.ogg'
import slime4 from '@res/sound/slime4.ogg'
import slime3 from '@res/sound/slime3.ogg'
import slime2 from '@res/sound/slime2.ogg'
import slime1 from '@res/sound/slime1.ogg'
import shot from '@res/sound/shot.ogg'
import pon from '@res/sound/pon.ogg'
import playerWalk from '@res/sound/playerWalk.ogg'
import playerLanding from '@res/sound/playerLanding.ogg'
import playerJump from '@res/sound/playerJump.ogg'
import playerHit from '@res/sound/playerHit.ogg'
import peti from '@res/sound/peti.ogg'
import mushroom from '@res/sound/mushroom.ogg'
import getAirTank from '@res/sound/getAirTank.ogg'
import foot from '@res/sound/foot.ogg'
import fire from '@res/sound/fire.ogg'
import enemyHit from '@res/sound/enemyHit.ogg'
import dandelionShot from '@res/sound/dandelionShot.ogg'
import danball from '@res/sound/danball.ogg'
import burner from '@res/sound/burner.ogg'
import airJet from '@res/sound/airJet.ogg'

import * as PIXI_SOUND from '@pixi/sound'

export type PlayOptions = PIXI_SOUND.PlayOptions & {
  pan?: number
}
type StereoFilter = InstanceType<typeof PIXI_SOUND.filters.StereoFilter>

export const soundStore: { [key: string]: PIXI_SOUND.Sound } = {}
export const play = (name: string, option?: PlayOptions): void => {
  option = option ? option : {}
  const sound = soundStore[name]
  if (option.pan) {
    const [stereoFilter] = sound.filters as StereoFilter[]
    stereoFilter.pan = option.pan
  }
  if (sound !== undefined) sound.play(option)
  else console.log(name, ':is not found')
}

const load = (url: string): Promise<PIXI_SOUND.Sound> => {
  return new Promise((resolve, reject) => {
    PIXI_SOUND.Sound.from({
      url: url,
      preload: true,
      loaded: (err, sound) => {
        if (err || !sound) {
          reject()
        } else {
          sound.filters = [new PIXI_SOUND.filters.StereoFilter()]
          resolve(sound)
        }
      },
    })
  })
}

export const init = async (): Promise<void> => {
  // LOAD_RESOURCE
  soundStore.start = await load(start)
  soundStore.snibeeDie = await load(snibeeDie)
  soundStore.snibee = await load(snibee)
  soundStore.slime4 = await load(slime4)
  soundStore.slime3 = await load(slime3)
  soundStore.slime2 = await load(slime2)
  soundStore.slime1 = await load(slime1)
  soundStore.shot = await load(shot)
  soundStore.pon = await load(pon)
  soundStore.playerWalk = await load(playerWalk)
  soundStore.playerLanding = await load(playerLanding)
  soundStore.playerJump = await load(playerJump)
  soundStore.playerHit = await load(playerHit)
  soundStore.peti = await load(peti)
  soundStore.mushroom = await load(mushroom)
  soundStore.getAirTank = await load(getAirTank)
  soundStore.foot = await load(foot)
  soundStore.fire = await load(fire)
  soundStore.enemyHit = await load(enemyHit)
  soundStore.dandelionShot = await load(dandelionShot)
  soundStore.danball = await load(danball)
  soundStore.burner = await load(burner)
  soundStore.airJet = await load(airJet)
}
