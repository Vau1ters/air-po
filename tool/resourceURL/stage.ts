import * as fs from 'fs'
import * as path from 'path'
import { buildMetaSource } from './build'

export const buildStage = (): string => {
  const importList: string[] = []
  const nameList: string[] = []

  return buildMetaSource({
    outputPath: 'src/game/stage/stageList.autogen.ts',
    watchDir: 'res/stage/autogen',
    templatePath: 'stageList.ts',
    onInput: (watchDir: string, e: fs.Dirent) => {
      if (e.isFile() === false) return
      const filename = e.name
      const baseName = path.parse(filename).name
      const match = /^(.*)\.autogen$/.exec(baseName)
      if (match == null) return
      const name = match[1]
      importList.push(`import ${name} from '@${watchDir}/${filename}'`)
      nameList.push(`${name},`)
    },
    replacementMap: () => {
      return {
        IMPORT: importList.join('\n'),
        OBJECT: nameList.join('\n'),
      }
    },
  })
}
