import type { Ref } from 'vue'
import { useLoadingStore } from '@/stores/Loading'
import type { TErrorResponse } from '@/models/Response/Response.model'

interface handleLoadingOptions {
  loadingUnit?: Ref<boolean>
}

function setIsLoading (
  isLoading: boolean,
  loadingUnit?: Ref<boolean>
): void {
  if (loadingUnit) {
    loadingUnit.value = isLoading
    return
  }
  const loadingStore = useLoadingStore()
  return isLoading
    ? loadingStore.addLoading()
    : loadingStore.removeLoading()
}

function addLoading (loadingUnit?: Ref<boolean>): void {
  setIsLoading(true, loadingUnit)
}
function removeLoading (loadingUnit?: Ref<boolean>): void {
  setIsLoading(false, loadingUnit)
}

export async function handleLoading<T> (
  callBack: (...args: any) => T,
  {
    loadingUnit,
  }: handleLoadingOptions = {},
  errorCallBack: (error?: TErrorResponse) => any = (error?: TErrorResponse): void => {
    console.error(error)
  }
): Promise<Awaited<T> | undefined> {
  try {
    addLoading(loadingUnit)
    const result = await callBack()
    return result
  } catch (error: TErrorResponse) {
    errorCallBack(error)
  } finally {
    removeLoading(loadingUnit)
  }
}

export default { handleLoading }
