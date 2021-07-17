import * as fs from 'fs'
import * as path from 'path'

export const buildComponent = (): void => {
  const outputPath = 'src/core/ecs/component.ts'
  const componentDir = 'src/game/components'

  const importList: string[] = []
  const mapList: string[] = []

  fs.readdirSync(componentDir, { withFileTypes: true }).forEach(e => {
    const filename = e.name
    const baseName = path.parse(filename).name
    const componentName = baseName[0].toUpperCase() + baseName.substr(1)
    const matchResult = componentName.match(/^(.*)Component$/)
    if (matchResult === null) {
      console.error(`invalid component name '${componentName}'`)
      return
    }
    const name = matchResult[1]
    importList.push(`import { ${componentName} } from '@${componentDir}/${baseName}'`)
    mapList.push(`${name}: ${componentName}`)
  })

  const headerText = fs.readFileSync('tool/template/header.ts', 'ascii')
  const generatedText = fs
    .readFileSync('tool/template/component.ts', 'ascii')
    .replace('// HEADER', headerText)
    .replace('// IMPORT', importList.join('\n'))
    .replace('// MAP', mapList.join('\n'))
  fs.writeFile(outputPath, generatedText, () => {})
}
