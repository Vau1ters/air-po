import { buildEntity } from './entity'
import { buildStage } from './stage'
import { buildAudio } from './audio'
import { buildSprite } from './sprite'
import { buildTile } from './tile'
import { buildObject } from './object'
import { buildComponent } from './component'
import * as cp from 'child_process'
import { buildItem } from './item'
import { buildUi } from './ui'
import { buildEquipment } from './equipment'
import { buildMovie } from './movie'

export const buildResourceURL = (): void => {
  const outputFiles: Array<string> = [
    buildSprite(),
    buildItem(),
    buildEquipment(),
    buildAudio(),
    buildEntity(),
    buildUi(),
    buildStage(),
    buildTile(),
    buildObject(),
    buildComponent(),
    buildMovie(),
  ]

  cp.execSync(`yarn eslint --fix ${outputFiles.join(' ')}`)
}
