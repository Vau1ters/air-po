import * as fs from 'fs'
import * as process from 'process'
import { buildMetaSource } from './build'

const toPascal = (s: string): string => {
  return s[0].toUpperCase() + s.substr(1)
}

export const buildEquipment = (): string => {
  const importList: string[] = []
  const nameList: string[] = []

  return buildMetaSource({
    outputPath: 'src/game/equipment/equipmentURL.autogen.ts',
    watchDir: 'res/equipment',
    templatePath: 'equipmentURL.ts',
    onInput: (watchDir: string, e: fs.Dirent) => {
      const { name } = require(`${process.cwd()}/${watchDir}/${e.name}`) // eslint-disable-line  @typescript-eslint/no-var-requires
      importList.push(`import ${name} from '@${watchDir}/${e.name}'`)
      importList.push(`import { ${toPascal(name)} } from '@game/equipment/${name}'`)
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
