import liff from "@line/liff"
import type { Profile } from "@liff/get-profile"

async function initLiff(): Promise<void> {
  const appId = import.meta.env.VITE_APP_LIFF_ID;
  if (appId !== undefined && appId !== null && appId !== '') {
    await liff.init({
      liffId: appId
    })
  }
}

async function getLiffProfile(): Promise<Profile> {
  try {
    const response = await liff.getProfile()
    return response
  } catch (error) {
    console.error(`Failed to get Liff profile: ${error}`)
    throw error
  }
}

async function loginLiff(): Promise<void> {
  if (liff.isLoggedIn()) {
    // Check if the existing login has a valid token
    if (isTokenValid()) {
      return // Already logged in with valid token
    } else {
      console.log('LIFF logged in but token is expired, forcing re-login')
      liff.login()
      return
    }
  }

  const lineVersion = liff.getLineVersion()
  const os = liff.getOS()
  if (os === 'web' || !lineVersion) {
    liff.login()
  }
}

async function checkTokenExpiry(): Promise<boolean> {
  try {
    if (!liff.isLoggedIn()) {
      return false
    }

    const idToken = liff.getIDToken()
    if (!idToken) {
      return false
    }

    const tokenParts = idToken.split('.')
    if (tokenParts.length !== 3) {
      console.error('Invalid token format')
      return false
    }

    const payload = JSON.parse(atob(tokenParts[1]))
    const now = Math.floor(Date.now() / 1000)
    const timeUntilExpiry = payload.exp - now

    console.log(`Token check - Current: ${now}, Expires: ${payload.exp}, Time until expiry: ${timeUntilExpiry}s`)

    // Token is valid if it has more than 5 minutes left
    return timeUntilExpiry > 300
  } catch (error) {
    console.error('Error checking token expiry:', error)
    return false
  }
}

async function refreshTokenIfNeeded(): Promise<boolean> {
  try {
    if (!liff.isLoggedIn()) {
      console.log('LIFF not logged in, need to login')
      return false
    }

    const idToken = liff.getIDToken()
    if (!idToken) {
      console.log('No LIFF ID token available')
      return false
    }

    const tokenParts = idToken.split('.')
    if (tokenParts.length !== 3) {
      console.error('Invalid token format')
      return false
    }

    // Check if token is expired
    const payload = JSON.parse(atob(tokenParts[1]))
    const now = Math.floor(Date.now() / 1000)
    const timeUntilExpiry = payload.exp - now

    if (timeUntilExpiry <= 0) {
      console.log(`LIFF ID token expired ${Math.abs(timeUntilExpiry)} seconds ago - need to re-login`)
      liff.login()
      return false
    }

    if (timeUntilExpiry < 300) {
      console.log(`LIFF ID token will expire in ${Math.floor(timeUntilExpiry / 60)} minutes - need to re-login soon`)
      // Don't auto-login yet, but warn
      return true
    }

    return true
  } catch (error) {
    console.error('Error checking token:', error)
    return false
  }
}

export default {
  liff
}

function isTokenValid(): boolean {
  try {
    if (!liff.isLoggedIn()) {
      return false
    }

    const idToken = liff.getIDToken()
    if (!idToken) {
      return false
    }

    const tokenParts = idToken.split('.')
    if (tokenParts.length !== 3) {
      return false
    }

    const payload = JSON.parse(atob(tokenParts[1]))
    const now = Math.floor(Date.now() / 1000)
    const timeUntilExpiry = payload.exp - now

    // Token is valid if it's not expired
    return timeUntilExpiry > 0
  } catch (error) {
    console.error('Error checking token validity:', error)
    return false
  }
}

export {
  initLiff,
  getLiffProfile,
  loginLiff,
  checkTokenExpiry,
  refreshTokenIfNeeded,
  isTokenValid
}
