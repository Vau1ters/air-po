import * as fs from 'fs'
import * as path from 'path'
import { buildMetaSource } from './build'

export const buildComponent = (): string => {
  const importList: string[] = []
  const nameList: string[] = []

  return buildMetaSource({
    outputPath: 'src/core/ecs/component.ts',
    watchDir: 'src/game/components',
    templatePath: 'tool/template/component.ts',
    onInput: (watchDir: string, e: fs.Dirent) => {
      const filename = e.name
      const baseName = path.parse(filename).name
      const componentName = baseName[0].toUpperCase() + baseName.substr(1)
      const matchResult = componentName.match(/^(.*)Component$/)
      if (matchResult === null) {
        console.error(`invalid name '${filename}'`)
        return
      }
      const name = matchResult[1]
      importList.push(`import { ${componentName} } from '${watchDir}/${baseName}'`)
      nameList.push(`${name}: ${componentName}`)
    },
    replacementMap: () => {
      return {
        IMPORT: importList.join('\n'),
        OBJECT: nameList.join('\n'),
      }
    },
  })
}
