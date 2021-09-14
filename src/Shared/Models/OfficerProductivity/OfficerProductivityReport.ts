export interface CurrentHierarchiesSingleResponse {
  id: string
  name?: string
  branches?: Array<string>
}

export interface CurrentHierarchiesResponse {
  response: CurrentHierarchiesSingleResponse[]
}
