import { getImageData, Pixel } from '../util/image'
import { assert } from '../../src/core/utils/assertion'
import { loadImage } from 'node-canvas'
import fs from 'fs'
import { TileCollider, TileColliderGeometry } from '../../src/game/entities/tileEntityFactory'

// prettier-ignore
const aabbShape = [
  0x00, 0x00, 0x00, 0x00,
  0x00, 0xff, 0xff, 0x00,
  0x00, 0xff, 0xff, 0x00,
  0x00, 0x00, 0x00, 0x00,
]
// prettier-ignore
const leftShape = [
  0x00, 0x00, 0x00, 0x00,
  0xff, 0xff, 0xff, 0x00,
  0xff, 0xff, 0xff, 0x00,
  0x00, 0x00, 0x00, 0x00,
]
// prettier-ignore
const rightShape = [
  0x00, 0x00, 0x00, 0x00,
  0x00, 0xff, 0xff, 0xff,
  0x00, 0xff, 0xff, 0xff,
  0x00, 0x00, 0x00, 0x00,
]
// prettier-ignore
const upShape = [
  0x00, 0xff, 0xff, 0x00,
  0x00, 0xff, 0xff, 0x00,
  0x00, 0xff, 0xff, 0x00,
  0x00, 0x00, 0x00, 0x00,
]
// prettier-ignore
const downShape = [
  0x00, 0x00, 0x00, 0x00,
  0x00, 0xff, 0xff, 0x00,
  0x00, 0xff, 0xff, 0x00,
  0x00, 0xff, 0xff, 0x00,
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
      const geometry = ((): TileColliderGeometry | undefined => {
        if (!foundShape) return undefined
        switch (foundShape[0]) {
          case 'aabbShape': {
            const solveDir = new Array<[number, number]>()
            if (matchShape(shape, leftShape)) solveDir.push([-1, 0])
            if (matchShape(shape, rightShape)) solveDir.push([+1, 0])
            if (matchShape(shape, upShape)) solveDir.push([0, -1])
            if (matchShape(shape, downShape)) solveDir.push([0, +1])
            return {
              type: 'AABB',
              size: [8, 8],
              solveDir,
            }
          }
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

const buildCollider = async (inputPath: string, outputPath: string): Promise<void> => {
  const image = await loadImage(inputPath)
  const buffer = getImageData(image)
  const collider = extractColliders(buffer)
  fs.writeFileSync(outputPath, JSON.stringify(collider, null, '  '))
}

export const buildColliders = async (): Promise<void> => {
  await buildCollider(
    __dirname + '/../../res/image/woodGuide.png',
    __dirname + '/../../res/collider/wood.json'
  )
  await buildCollider(
    __dirname + '/../../res/image/wallGuide.png',
    __dirname + '/../../res/collider/wall.json'
  )
}
