import { buildEntity } from './entity'
import { buildStage } from './stage'
import { buildAudio } from './audio'
import { buildSprite } from './sprite'
import { buildTile } from './tile'
import { buildObject } from './object'
import { buildComponent } from './component'
import * as cp from 'child_process'
import { buildItem } from './item'
import { buildEquipment } from './equipment'

export const buildResourceURL = (): void => {
  const outputFiles: Array<string> = [
    buildSprite(),
    buildItem(),
    buildEquipment(),
    buildAudio(),
    buildEntity(),
    buildStage(),
    buildTile(),
    buildObject(),
    buildComponent(),
  ]

  cp.execSync(`./node_modules/.bin/eslint --fix ${outputFiles.join(' ')}`)
}
