import { useAuthStore } from '@/stores/Auth'
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import humps from 'humps'
import liff from '@line/liff'
import { tokenManager } from '@/utils/TokenManager'

function getAuthStore() {
  try {
    return useAuthStore()
  } catch (error) {
    console.warn('Auth store not available yet:', error)
    return null
  }
}

export async function onRequest(config: AxiosRequestConfig): Promise<AxiosRequestConfig> {
  config.withCredentials = true
  config.headers = config.headers ?? {}

  // Add Authorization header if we have a token
  const authStore = getAuthStore()
  if (authStore?.userToken.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.userToken.accessToken}`
  }

  if (config.headers['Content-Type'] === 'multipart/form-data') {
    return config
  }
  return {
    ...config
    // data: config.data ? humps.decamelizeKeys(config.data) : config.data,
    // params: config.params ? humps.decamelizeKeys(config.params) : config.params
  }
}

export function onRequestError(error: AxiosError): Promise<AxiosError> {
  console.error(`[request error] [${JSON.stringify(error)}]`)
  return Promise.reject(error)
}

export function onResponse(response: AxiosResponse): Promise<any> {
  if (!response || !response.data) {
    const error: any = response
    throw error
  }
  if (response.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    return response.data
  }
  const res: any = humps.camelizeKeys(response.data)
  return Promise.resolve(res)
}

export async function onResponseError(error: AxiosError): Promise<any> {
  const newError = error
  const originalRequest = error.config as any

  if (
    error.request.responseType === 'blob'
    && error?.response?.data instanceof Blob
    && error?.response?.data?.type
    && error?.response?.data?.type.toLowerCase().indexOf('json') !== -1
  ) {
    await new Promise((resolve: any, reject: any): void => {
      const reader = new FileReader() as any
      reader.onload = (): any => {
        // @ts-ignore: set new error data
        newError.response.data = JSON.parse(reader.result)
        resolve(Promise.reject(newError?.response?.data))
      }

      reader.onerror = (): any => {
        reject(error)
      }

      reader.readAsText(error?.response?.data)
    })

    return Promise.reject(newError?.response?.data)
  }

  // Handle 401 errors - JWT token expired or invalid, redirect to login immediately
  if (newError.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true

    try {
      console.log('401 error detected - JWT token expired, redirecting to login')

      // Clear auth store
      const authStore = getAuthStore()
      if (authStore) {
        authStore.logout()
      }

      // Stop token monitoring to prevent loops
      tokenManager.stopTokenMonitoring()

      // Force re-login immediately
      liff.login()

      // Don't return error, just redirect
      return new Promise(() => {}) // Never resolve to prevent further processing

    } catch (loginError) {
      console.error('Error handling 401:', loginError)
      
      // Fallback to LINE access URL
      window.location.href = 'https://access.line.me'
      
      return new Promise(() => {}) // Never resolve
    }
  }

  if (newError?.response?.data) {
    return Promise.reject(newError.response.data)
  }

  return Promise.reject(newError)
}
