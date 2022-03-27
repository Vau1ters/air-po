import * as fs from 'fs'
import { buildMetaSource } from './build'

export const buildAudio = (): string => {
  const importList: string[] = []
  const nameList: string[] = []

  return buildMetaSource({
    outputPath: 'src/core/sound/soundURL.autogen.ts',
    watchDir: 'res/audio',
    templatePath: 'soundURL.ts',
    onInput: (watchDir: string, e: fs.Dirent) => {
      const { name } = require(`${process.cwd()}/${watchDir}/${e.name}`) // eslint-disable-line  @typescript-eslint/no-var-requires
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
