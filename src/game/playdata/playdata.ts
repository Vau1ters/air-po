export type PlayData = {
  status: StoryStatus
  mapName?: string
}

export enum StoryStatus {
  Opening,
  Stage,
}

export const InitialPlayData: PlayData = {
  status: StoryStatus.Opening,
}

export const loadPlayData = (): PlayData => {
  const data = localStorage.getItem('playdata')
  return data ? (JSON.parse(data) as PlayData) : InitialPlayData
}

export const savePlayData = (data: PlayData): void => {
  localStorage.setItem('playdata', JSON.stringify(data))
}
