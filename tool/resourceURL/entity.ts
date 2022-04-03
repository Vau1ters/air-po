import * as fs from 'fs'
import * as path from 'path'
import { buildMetaSource } from './build'

export const buildEntity = (): string => {
  const importList: string[] = []
  const nameList: string[] = []

  return buildMetaSource({
    outputPath: 'src/game/entities/loader/entitySetting.autogen.ts',
    watchDir: 'res/entity',
    templatePath: 'entitySetting.ts',
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
