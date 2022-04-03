/*+. NOTIFICATION .+*/
// this file is automatically written by script.
// you can update this file by type "yarn metabuild" command.

import airJet from '@res/audio/airJet.json'
import bgm1 from '@res/audio/bgm1.json'
import bossAttack1 from '@res/audio/bossAttack1.json'
import bossBgm1 from '@res/audio/bossBgm.json'
import burner from '@res/audio/burner.json'
import danball from '@res/audio/danball.json'
import dandelionShot from '@res/audio/dandelionShot.json'
import enemyHit from '@res/audio/enemyHit.json'
import fire from '@res/audio/fire.json'
import flag from '@res/audio/flag.json'
import foot from '@res/audio/foot.json'
import foot1 from '@res/audio/foot1.json'
import foot2 from '@res/audio/foot2.json'
import foot3 from '@res/audio/foot3.json'
import foot4 from '@res/audio/foot4.json'
import getAirTank from '@res/audio/getAirTank.json'
import grab from '@res/audio/grab.json'
import hpHeal from '@res/audio/hpHeal.json'
import largeCoin from '@res/audio/largeCoin.json'
import mushroom from '@res/audio/mushroom.json'
import peti from '@res/audio/peti.json'
import playerHit from '@res/audio/playerHit.json'
import playerJump from '@res/audio/playerJump.json'
import playerLanding from '@res/audio/playerLanding.json'
import playerWalk from '@res/audio/playerWalk.json'
import poison from '@res/audio/poison.json'
import pon from '@res/audio/pon.json'
import shot from '@res/audio/shot.json'
import slime1 from '@res/audio/slime1.json'
import slime2 from '@res/audio/slime2.json'
import slime3 from '@res/audio/slime3.json'
import slime4 from '@res/audio/slime4.json'
import smallCoin from '@res/audio/smallCoin.json'
import snibee from '@res/audio/snibee.json'
import snibeeDie from '@res/audio/snibeeDie.json'
import start from '@res/audio/start.json'

export type AudioSetting = {
  path: string
  maxVolume: number
  loop?: {
    start: number
    end: number
  }
}

export const soundURL: { [key: string]: AudioSetting } = {
  airJet,
  bgm1,
  bossAttack1,
  bossBgm1,
  burner,
  danball,
  dandelionShot,
  enemyHit,
  fire,
  flag,
  foot,
  foot1,
  foot2,
  foot3,
  foot4,
  getAirTank,
  grab,
  hpHeal,
  largeCoin,
  mushroom,
  peti,
  playerHit,
  playerJump,
  playerLanding,
  playerWalk,
  poison,
  pon,
  shot,
  slime1,
  slime2,
  slime3,
  slime4,
  smallCoin,
  snibee,
  snibeeDie,
  start,
}
