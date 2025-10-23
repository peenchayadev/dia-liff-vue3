import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { accessTokenStorage } from '@/utils/Storage'

interface IUser {
	id: number | null
	uid?: string | null
	imageUrl: string
	displayName: string
}

interface IToken {
	accessToken: string
	expireIn: number | null
}

interface IAuthStore {
	user: Ref<IUser>
	userToken: Ref<IToken>
  stampLineIdToken (token: string): void
  getLineIdToken (): string
  isAuthenticated (): boolean
  logout (): void
}

export const useAuthStore = defineStore<'Auth', IAuthStore>('Auth', (): IAuthStore => {
	const user = ref<IUser>({
		id: null,
		uid: null,
		imageUrl: '',
		displayName: ''
	})

	const userToken = ref<IToken>({
		accessToken: '',
		expireIn: null
	})

	const lineIdToken = ref<string>('')

  function stampLineIdToken(token: string): void {
		lineIdToken.value = token
	}

  function logout(): void {
		user.value = {
			id: null,
			uid: null,
			displayName: '',
			imageUrl: ''
		}

		userToken.value = {
			accessToken: '',
			expireIn: null
		}

		lineIdToken.value = ''
	}

  function getLineIdToken(): string {
		return lineIdToken.value
	}

  function isAuthenticated(): boolean {
		return !!(userToken.value.accessToken && user.value.uid)
	}

  return {
    user,
    userToken,
    stampLineIdToken,
    logout,
    getLineIdToken,
    isAuthenticated
  }
  }, {
  persist: [
    {
      pick: ['user'],
      storage: accessTokenStorage
    },
    {
      pick: ['userToken'],
      storage: accessTokenStorage
    }
  ]
})
