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
    return
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

    const payload = JSON.parse(atob(idToken?.split('.')[1] || ''))
    const now = Math.floor(Date.now() / 1000)
    const timeUntilExpiry = payload.exp - now

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

    const isValid = await checkTokenExpiry()

    if (!isValid) {
      console.log('LINE ID token expired or invalid')
      return false
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

export {
  initLiff,
  getLiffProfile,
  loginLiff,
  checkTokenExpiry,
  refreshTokenIfNeeded
}
