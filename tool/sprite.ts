import * as fs from 'fs'
import { buildMetaSource } from './build'

export const buildSprite = (): string => {
  const importList: string[] = []
  const nameList: string[] = []

  return buildMetaSource({
    outputPath: 'src/core/graphics/spriteURL.ts',
    watchDir: 'res/sprite',
    templatePath: 'tool/template/spriteURL.ts',
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
