import * as fs from 'fs'

const fileText = `
// IMPORT

import { BaseTexture, Rectangle, Texture } from 'pixi.js'

type Setting = {
  columns: number
  image: string
  imageheight: number
  imagewidth: number
  margin: number
  name: string
  spacing: number
  tilecount: number
  tiledversion: string
  tileheight: number
  tilewidth: number
  type: string
  version: number
}

function loadTexture(url: string): Promise<BaseTexture> {
  return new Promise((resolve, reject) => {
    const texture = BaseTexture.from(url)
    if (texture.width > 0) resolve(texture)
    texture.on('loaded', (tex: BaseTexture) => {
      resolve(tex)
    })
    texture.on('error', (_tex: BaseTexture, event: ErrorEvent) => {
      reject(event)
    })
  })
}

async function buildAnimationTexture(baseURL: string, setting: Setting): Promise<Array<Texture>> {
  const base = await loadTexture(baseURL)
  const result = new Array<Texture>()
  const w = setting.tilewidth
  const h = setting.tileheight
  for (let y = 0; y < base.height / h; y++) {
    for (let x = 0; x < base.width / w; x++) {
      const texture = new Texture(base, new Rectangle(x * w, y * h, w, h))
      result.push(texture)
    }
  }
  return result
}

async function buildSingleTexture(baseURL: string): Promise<Array<Texture>> {
  const base = await loadTexture(baseURL)
  const result = new Array<Texture>()
  result.push(new Texture(base))
  return result
}

export const textureStore: { [key: string]: Array<Texture> } = {}
export const init = async (): Promise<void> => {
// LOAD_RESOURCE
}
`
function snakeToCamel(p: string): string {
  return p.replace(/_./g, s => {
    return s.charAt(1).toUpperCase()
  })
}

const outputPath = 'src/core/graphics/art.ts'
const artPath = 'res/image'
const mapPath = 'res/map'

function importText(filename: string, ext: string): string {
  const camelFilename = snakeToCamel(filename)
  return ext === 'png'
    ? `import ${camelFilename}Img from '@${artPath}/${filename}.${ext}'`
    : `import ${camelFilename}Setting from '@${mapPath}/${filename}.${ext}'`
}
function loadImgText(filename: string): string {
  return `textureStore.${filename} = await buildSingleTexture(${filename}Img)`
}
const imgdir = fs.readdirSync(artPath, { withFileTypes: true })
const mapdir = fs.readdirSync(mapPath, { withFileTypes: true })
let generatedText = fileText

imgdir.forEach(e => {
  const filename = e.name.split('.')[0]
  const camelFilename = snakeToCamel(filename)
  const ext = e.name.split('.')[1]
  const importReg = new RegExp('// IMPORT')
  const loadReg = new RegExp('// LOAD_RESOURCE')
  generatedText = generatedText.replace(importReg, `// IMPORT\n${importText(filename, ext)}`)
  generatedText = generatedText.replace(
    loadReg,
    `// LOAD_RESOURCE\n  ${loadImgText(camelFilename)}`
  )
})
mapdir.forEach(e => {
  const filename = e.name.split('.')[0]
  const camelFilename = snakeToCamel(filename)
  const ext = e.name.split('.')[1]
  const importReg = new RegExp('// IMPORT')
  const loadReg = new RegExp('buildSingleTexture\\(' + `${camelFilename}Img`)
  generatedText = generatedText.replace(importReg, `// IMPORT\n${importText(filename, ext)}`)
  generatedText = generatedText.replace(
    loadReg,
    `buildAnimationTexture(${camelFilename}Img, ${camelFilename}Setting`
  )
})
const notificationText = `/*+.† NOTIFICATION †.+*/
// this file is automatically written by arttool.
// you can update this file by type "yarn arttool" command.
`

fs.writeFile(outputPath, notificationText + generatedText, () => {})
