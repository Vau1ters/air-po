import * as fs from 'fs'
import * as path from 'path'
import { buildMetaSource } from './build'

export const buildAudio = (): string => {
  const importList: string[] = []
  const nameList: string[] = []

  return buildMetaSource({
    outputPath: 'src/core/sound/soundURL.ts',
    watchDir: 'res/audio',
    templatePath: 'tool/template/soundURL.ts',
    onInput: (watchDir: string, e: fs.Dirent) => {
      const { name } = require(`../${watchDir}/${e.name}`) // eslint-disable-line  @typescript-eslint/no-var-requires
      importList.push(`import ${name} from '@${watchDir}/${e.name}'`)
      nameList.push(name)
    },
    replacementMap: () => {
      return {
        IMPORT: importList.join('\n'),
        OBJECT: nameList.join(','),
      }
    },
  })
}
