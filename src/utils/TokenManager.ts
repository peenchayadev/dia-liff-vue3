import liff from '@line/liff'
import { useAuthStore } from '@/stores/Auth'

export class TokenManager {
  private static instance: TokenManager
  private checkInterval: number | null = null

  private constructor() { }

  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager()
    }
    return TokenManager.instance
  }

  public startTokenMonitoring(): void {
    // Clear existing interval
    this.stopTokenMonitoring()

    // Check token every 2 minutes
    this.checkInterval = setInterval(() => {
      this.checkTokenExpiry()
    }, 2 * 60 * 1000)

    // Initial check
    this.checkTokenExpiry()
  }

  public stopTokenMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
    }
  }

  private checkTokenExpiry(): void {
    try {
      const authStore = useAuthStore()
      const jwtToken = authStore.userToken.accessToken

      if (!jwtToken) {
        console.log('No JWT token available')
        return
      }

      const tokenParts = jwtToken.split('.')
      if (tokenParts.length !== 3) {
        console.error('Invalid JWT token format')
        return
      }

      const payload = JSON.parse(atob(tokenParts[1] || ''))
      const now = Math.floor(Date.now() / 1000)
      const timeUntilExpiry = payload.exp - now

      if (timeUntilExpiry <= 0) {
        console.log(`JWT token expired ${Math.abs(timeUntilExpiry)} seconds ago - logging out`)
        this.handleTokenExpiry()
      } else if (timeUntilExpiry < 300) { // Less than 5 minutes
        console.warn(`JWT token will expire in ${Math.floor(timeUntilExpiry / 60)} minutes`)
      }

    } catch (error) {
      console.error('Error checking JWT token expiry:', error)
    }
  }

  private handleTokenExpiry(): void {
    try {
      // Clear auth store
      const authStore = useAuthStore()
      authStore.logout()

      // Stop monitoring
      this.stopTokenMonitoring()

      // Force LIFF re-login immediately
      console.log('Token expired - redirecting to login')
      liff.login()

    } catch (error) {
      console.error('Error handling token expiry:', error)
      // Fallback to LINE access URL
      window.location.href = 'https://access.line.me'
    }
  }

  public isTokenValid(): boolean {
    try {
      const authStore = useAuthStore()
      const jwtToken = authStore.userToken.accessToken

      if (!jwtToken) {
        return false
      }

      const tokenParts = jwtToken.split('.')
      if (tokenParts.length !== 3) {
        return false
      }

      const payload = JSON.parse(atob(tokenParts[1] || ''))
      const now = Math.floor(Date.now() / 1000)
      const timeUntilExpiry = payload.exp - now

      return timeUntilExpiry > 0
    } catch (error) {
      console.error('Error checking JWT token validity:', error)
      return false
    }
  }
}

export const tokenManager = TokenManager.getInstance()