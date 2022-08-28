import * as fs from 'fs'
import * as path from 'path'
import { buildMetaSource } from './build'

export const buildUi = (): string => {
  const importList: string[] = []
  const nameList: string[] = []

  return buildMetaSource({
    outputPath: 'src/game/entities/ui/loader/uiSetting.autogen.ts',
    watchDir: 'res/ui',
    templatePath: 'uiSetting.ts',
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
