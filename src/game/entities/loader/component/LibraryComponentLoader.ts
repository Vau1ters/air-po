import * as t from 'io-ts'
import { LibraryComponent } from '@game/components/libraryComponent'

export const LibrarySettingType = t.type({
  description: t.array(t.string),
})
export type LibrarySetting = t.TypeOf<typeof LibrarySettingType>

export const loadLibraryComponent = (setting: LibrarySetting): LibraryComponent => {
  return new LibraryComponent(setting.description)
}
