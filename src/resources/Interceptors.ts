import { useAuthStore } from '@/stores/Auth'
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import humps from 'humps'
import liff from '@line/liff'
import { refreshTokenIfNeeded } from '@/plugin/liff.plugin'
import axios from 'axios'

let authService: any = null
async function getAuthService() {
  if (!authService) {
    const { default: AuthProvider } = await import('./provider/Auth.provider')
    authService = new AuthProvider()
  }
  return authService
}

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

  // Check and refresh token if needed before making request
  try {
    await refreshTokenIfNeeded()
  } catch (error) {
    console.warn('Token refresh check failed:', error)
  }

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

  // Handle 401 errors with token refresh
  if (newError.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true

    try {
      console.log('401 error detected, attempting token refresh...')

      if (!liff.isLoggedIn()) {
        console.log('LIFF not logged in, redirecting to login')
        await liff.login()
        return Promise.reject(newError.response?.data)
      }

      const lineIdToken = liff.getIDToken()
      if (!lineIdToken) {
        console.log('No LINE ID token available, redirecting to login')
        liff.login()
        return Promise.reject(newError.response?.data)
      }

      const authSvc = await getAuthService()
      const refreshResponse = await authSvc.refreshToken(lineIdToken)

      if (refreshResponse?.success !== false && refreshResponse?.data?.jwt) {
        console.log('Token refreshed successfully')

        const authStore = getAuthStore()
        if (authStore) {
          authStore.stampLineIdToken(refreshResponse.data.jwt)
          authStore.userToken.accessToken = refreshResponse.data.jwt
          authStore.user = {
            id: null,
            uid: refreshResponse.data.user?.lineUserId,
            imageUrl: refreshResponse.data.user?.pictureUrl || '',
            displayName: refreshResponse.data.user?.displayName || ''
          }
        }

        originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.jwt}`

        return axios(originalRequest)
      } else {
        throw new Error('Token refresh failed - no JWT returned')
      }

    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError)

      try {
        liff.login()
      } catch (loginError) {
        console.error('LIFF login failed:', loginError)
        const authStore = getAuthStore()
        if (authStore) {
          authStore.logout()
        }
        window.location.href = `https://access.line.me`
      }

      return Promise.reject(newError.response?.data)
    }
  }

  if (newError?.response?.data) {
    return Promise.reject(newError.response.data)
  }

  return Promise.reject(newError)
}
