import * as fs from 'fs'
import * as path from 'path'
import { buildMetaSource } from './build'

export const buildSound = (): void => {
  const importList: string[] = []
  const nameList: string[] = []

  buildMetaSource({
    outputPath: 'src/core/sound/soundURL.ts',
    watchDir: 'res/sound',
    templatePath: 'tool/template/soundURL.ts',
    onInput: (watchDir: string, e: fs.Dirent) => {
      const filename = e.name
      const name = path.parse(filename).name
      importList.push(`import ${name} from '@${watchDir}/${filename}'`)
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
