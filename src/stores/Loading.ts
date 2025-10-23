import type { ComputedRef, Ref } from 'vue'
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export interface ILoadingStore {
  loadingCount: Ref<number>
  isLoading: ComputedRef<boolean>
  addLoading(): void
  removeLoading(): void
}

export const useLoadingStore = defineStore<'Loading', ILoadingStore>('Loading', (): ILoadingStore => {
  const loadingCount = ref<number>(0)
  const isLoading = computed<boolean>((): boolean => !!loadingCount.value)

  function addLoading (): void {
    loadingCount.value++
  }

  function removeLoading (): void {
    const count = loadingCount.value - 1
    loadingCount.value = count < 0 ? 0 : count
  }

  return {
    loadingCount,
    isLoading,
    addLoading,
    removeLoading
  }
}, {
  persist: false
})
