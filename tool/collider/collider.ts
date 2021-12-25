import { getImageData, Pixel } from '../util/image'
import { assert } from '../../src/core/utils/assertion'
import { loadImage } from 'node-canvas'
import fs from 'fs'

// prettier-ignore
const aabbShape = [
  0xff, 0xff, 0xff, 0xff,
  0xff, 0xff, 0xff, 0xff,
  0xff, 0xff, 0xff, 0xff,
  0xff, 0xff, 0xff, 0xff,
]
// prettier-ignore
const leftUpSlope = [
  0x00, 0x00, 0x00, 0xff,
  0x00, 0x00, 0xff, 0xff,
  0x00, 0xff, 0xff, 0xff,
  0xff, 0xff, 0xff, 0xff,
]
// prettier-ignore
const rightUpSlope = [
  0xff, 0x00, 0x00, 0x00,
  0xff, 0xff, 0x00, 0x00,
  0xff, 0xff, 0xff, 0x00,
  0xff, 0xff, 0xff, 0xff,
]
// prettier-ignore
const leftDownSlope = [
  0xff, 0xff, 0xff, 0xff,
  0x00, 0xff, 0xff, 0xff,
  0x00, 0x00, 0xff, 0xff,
  0x00, 0x00, 0x00, 0xff,
]
// prettier-ignore
const rightDownSlope = [
  0xff, 0xff, 0xff, 0xff,
  0xff, 0xff, 0xff, 0x00,
  0xff, 0xff, 0x00, 0x00,
  0xff, 0x00, 0x00, 0x00,
]

type Geometry =
  | { type: 'AABB'; size: [number, number]; solveDir: Array<[number, number]> }
  | {
      type: 'Slope'
      size: [number, number]
      normal: [number, number]
      solveDir: Array<[number, number]>
    }

type TileCollider = {
  index: number
  geometry?: Geometry
}

const extractColliders = (image: ImageData): Array<TileCollider> => {
  assert(image.width % 8 === 0, '')
  assert(image.height % 8 === 0, '')
  const nx = image.width / 8
  const ny = image.height / 8
  const result = new Array<TileCollider>()
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const shape = new Array<number>()
      for (let y = 2; y < 6; y++) {
        for (let x = 2; x < 6; x++) {
          const pixel = new Pixel(i * 8 + x, j * 8 + y, image)
          shape.push(pixel.rgba.r)
        }
      }
      const matchShape = (target: Array<number>, expected: Array<number>): boolean => {
        for (let i = 0; i < target.length; i++) {
          if (expected[i] == 0xff && target[i] !== 0xff) return false
        }
        return true
      }
      const foundShape = Object.entries({
        aabbShape,
        leftUpSlope,
        rightUpSlope,
        leftDownSlope,
        rightDownSlope,
      }).find(([_, s]) => matchShape(shape, s))
      const geometry = ((): Geometry | undefined => {
        if (!foundShape) return undefined
        switch (foundShape[0]) {
          case 'aabbShape':
            return {
              type: 'AABB',
              size: [8, 8],
              solveDir: [
                [0, +1],
                [0, -1],
              ],
            } // for smooth walk
          case 'leftUpSlope':
            return { type: 'Slope', size: [8, 8], normal: [-1, -1], solveDir: [[0, -1]] }
          case 'rightUpSlope':
            return { type: 'Slope', size: [8, 8], normal: [+1, -1], solveDir: [[0, -1]] }
          case 'leftDownSlope':
            return { type: 'Slope', size: [8, 8], normal: [-1, +1], solveDir: [[0, +1]] }
          case 'rightDownSlope':
            return { type: 'Slope', size: [8, 8], normal: [+1, +1], solveDir: [[0, +1]] }
        }
        assert(false, '')
      })()
      result.push({
        index: result.length,
        geometry,
      })
    }
  }
  return result
}

export const buildColliders = async (): Promise<void> => {
  const image = await loadImage(__dirname + '/../../res/image/woodGuideTile.png')
  const buffer = getImageData(image)
  const collider = extractColliders(buffer)
  fs.writeFileSync(
    __dirname + '/../../res/collider/wood.json',
    JSON.stringify(collider, null, '  ')
  )
}
