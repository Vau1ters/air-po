import * as t from 'io-ts'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { createObjectLayerLoader, ObjectLayer, ObjectLayerType } from './objectLayerLoader'
import { createTileLayerLoader, TileLayer, TileLayerType } from './tileLayerLoader'
import { stageList } from './stageList.autogen'
import { createAirLayerLoader } from './airLayerLoader'
import { createBackgroundLayerLoader } from './backgroundLayerLoader'
import { TileSetType } from './tileSet'
import { decodeJson } from '@utils/json'
import { toSoundName } from '@core/sound/sound'
import { getSingleton } from '@game/systems/singletonSystem'
import { Entity } from '@core/ecs/entity'
import { FamilyBuilder } from '@core/ecs/family'
import { StagePoint } from '@game/components/stagePointComponent'
import { chaseCameraAI } from '@game/ai/entity/camera/chaseCameraAI'
import { CameraFactory } from '@game/entities/cameraFactory'
import { LaserSightFactory } from '@game/entities/laserSightFactory'
import { assert } from '@utils/assertion'
import { PlayerFactory } from '@game/entities/playerFactory'
import { PlayerData } from '@game/playdata/playdata'
import { findCustomProperty } from './customProperty'

export type StageName = keyof typeof stageList

const LayerType = t.union([TileLayerType, ObjectLayerType])
type Layer = t.TypeOf<typeof LayerType>

const StageType = t.type({
  compressionlevel: t.number,
  height: t.number,
  infinite: t.boolean,
  layers: t.array(LayerType),
  nextlayerid: t.number,
  nextobjectid: t.number,
  orientation: t.literal('orthogonal'),
  renderorder: t.literal('right-up'),
  tiledversion: t.string,
  tileheight: t.number,
  tilesets: t.array(TileSetType),
  tilewidth: t.number,
  type: t.literal('map'),
  version: t.string,
  width: t.number,
})

export type StageSetting = t.TypeOf<typeof StageType>

const loadStageImpl = function* (stageName: StageName, world: World): Generator<Entity> {
  const stage = decodeJson<StageSetting>(stageList[stageName], StageType)
  const tileSize = new Vec2(stage.tilewidth, stage.tileheight)
  const loadTileLayer = createTileLayerLoader(stage.tilesets, tileSize)
  const loadAirLayer = createAirLayerLoader(world, stageName)
  const loadBackgroundLayer = createBackgroundLayerLoader(stage.tilesets)
  const loadObjectLayer = createObjectLayerLoader(world, stage.tilesets, stageName)
  for (const layer of stage.layers) {
    switch (layer.type) {
      case 'tilelayer':
        yield* loadTileLayer(layer as TileLayer)
        break
      case 'objectgroup':
        switch (layer.name) {
          case 'air':
            yield* loadAirLayer(layer as ObjectLayer)
            break
          case 'background':
            yield* loadBackgroundLayer(layer as ObjectLayer)
            break
          default:
            yield* loadObjectLayer(layer as ObjectLayer)
            break
        }
        break
    }
  }
  const mapLayer = stage.layers.find((layer: Layer): boolean => layer.name === 'map')
  if (mapLayer) {
    const bgmName = findCustomProperty(mapLayer, 'string', 'bgm')
    getSingleton('Bgm', world)
      .getComponent('Bgm')
      .request(bgmName ? toSoundName(bgmName) : undefined)
  }
}

export type StageInfo = {
  playerData: PlayerData
  spawnPoint: StagePoint
  bgm: Entity
}

export const loadStage = (world: World, stageInfo: StageInfo): void => {
  const {
    playerData,
    spawnPoint: { stageName, pointID },
    bgm,
  } = stageInfo

  const player = new PlayerFactory(world, playerData).create()
  const camera = new CameraFactory().create()
  const laserSight = new LaserSightFactory(world).create()

  camera.getComponent('Camera').aiStack.push(chaseCameraAI(camera, player))

  world.addEntity(player)
  world.addEntity(camera)
  world.addEntity(laserSight)
  world.addEntity(player.getComponent('Player').ui)
  world.addEntity(bgm)
  world.addEntity(...loadStageImpl(stageName, world))

  const stagePointFamily = new FamilyBuilder(world).include('StagePoint').build()
  const stagePoint = stagePointFamily.entityArray.find(
    e => e.getComponent('StagePoint').stagePoint.pointID === pointID
  )
  assert(stagePoint !== undefined, `player spawner ID '${pointID}' is not found`)

  player.getComponent('Position').assign(stagePoint.getComponent('Position'))
}
