import * as fs from 'fs'
import * as process from 'process'
import { buildMetaSource } from './build'

export const buildItem = (): string => {
  const importList: string[] = []
  const nameList: string[] = []

  return buildMetaSource({
    outputPath: 'src/game/flow/inventory/itemURL.ts',
    watchDir: 'res/item',
    templatePath: 'itemURL.ts',
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
