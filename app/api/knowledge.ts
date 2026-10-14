
export interface KnowledgeItem {
  id: string
  title: string
  content: string
}

export interface SearchParams {
  keyword: string
  ai_search?: boolean
}

export interface SearchResult {
  list: KnowledgeItem[]
  total: number
}

export const useKnowledgeApi = () => {
  const request = useRequest()
  return {
    searchPost(params: SearchParams) {
      return request.post<SearchResult>(
        '/search',
        params,
      )
    },

    searchGet(options?:any) {
      return request.get<SearchResult>(
        '/search'
      )
    }
  }
}
