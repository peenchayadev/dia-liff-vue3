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
  if (await liff.isLoggedIn()) {
    return
  }

  const lineVersion = await liff.getLineVersion()
  const os = await liff.getOS()
  if (os === 'web' || !lineVersion) {
    await liff.login()
  }
}

export default {
  liff
}

export {
  initLiff,
  getLiffProfile,
  loginLiff
}
