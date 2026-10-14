
import type { FetchOptions } from 'ofetch'

export const useRequest = () => {
  const config = useRuntimeConfig()

  const request = $fetch.create({
    baseURL: '/api',
    timeout: 30000,

    onRequest({ options }) {
      // 统一添加请求头、Token 等
    },

    onResponseError({ response }) {
      switch (response.status) {
        case 401:
          console.error('请先登录')
          break
        case 403:
          console.error('没有访问权限')
          break
        case 404:
          console.error('请求的资源不存在')
          break
        case 500:
          console.error('服务器异常')
          break
        default:
          console.error('请求失败')
      }
    },
  })

  return {
    get<T>(url: string, options?: FetchOptions<'json'>) {
      return request<T>(url, {
        ...options,
        method: 'GET',
      })
    },

    post<T>(
      url: string,
      body?: unknown,
      options?: FetchOptions<'json'>,
    ) {
      return request<T>(url, {
        ...options,
        method: 'POST',
        body,
      })
    },

    put<T>(
      url: string,
      body?: unknown,
      options?: FetchOptions<'json'>,
    ) {
      return request<T>(url, {
        ...options,
        method: 'PUT',
        body,
      })
    },

    delete<T>(url: string, options?: FetchOptions<'json'>) {
      return request<T>(url, {
        ...options,
        method: 'DELETE',
      })
    },
  }
}
