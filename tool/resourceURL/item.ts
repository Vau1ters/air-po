import * as fs from 'fs'
import * as process from 'process'
import { buildMetaSource } from './build'

const toPascal = (s: string): string => {
  return s[0].toUpperCase() + s.substr(1)
}

export const buildItem = (): string => {
  const importList: string[] = []
  const nameList: string[] = []

  return buildMetaSource({
    outputPath: 'src/game/item/itemURL.ts',
    watchDir: 'res/item',
    templatePath: 'itemURL.ts',
    onInput: (watchDir: string, e: fs.Dirent) => {
      const { name } = require(`${process.cwd()}/${watchDir}/${e.name}`) // eslint-disable-line  @typescript-eslint/no-var-requires
      importList.push(`import ${name} from '@${watchDir}/${e.name}'`)
      importList.push(`import { ${toPascal(name)} } from '@game/item/${name}'`)
      nameList.push(name)
    },
    replacementMap: () => {
      return {
        IMPORT: importList.join('\n'),
        URL: nameList.join(','),
        CLASS: nameList.map(name => `${name}: ${toPascal(name)}`).join(','),
      }
    },
  })
}
