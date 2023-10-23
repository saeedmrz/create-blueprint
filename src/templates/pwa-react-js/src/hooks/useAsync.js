import {useRef, useLayoutEffect, useCallback, useReducer} from 'react'

function useSafeDisatch(dispatch) {
  const mounted = useRef(false)

  useLayoutEffect(() => {
    mounted.current = true

    return () => (mounted.current = false)
  }, [])

  useCallback(
    (...args) => (mounted.current ? dispatch(...args) : void 0),
    [dispatch],
  )
}

const initialDefaultState = {status: 'idle', data: null, error: null}

function useAsync(initialState) {
  const initialStateRef = useRef({...initialDefaultState, ...initialState})

  const [{state, data, error}, setState] = useReducer(
    (s, a) => ({...s, ...a}),
    initialStateRef.current,
  )

  const safeSetState = useSafeDisatch(setState)

  const setData = useCallback(
    data => safeSetState({status: 'resolved', data: data}),
    [safeSetState],
  )

  const setError = useCallback(
    error => safeSetState({status: 'rejected', error: error}),
    [safeSetState],
  )

  const reset = useCallback(
    () => safeSetState(initialStateRef.current),
    [safeSetState],
  )

  const run = useCallback(
    promise => {
      if (!promise || !promise.then) {
        throw new Error(
          'The argument passed to useAsync(). run must be a promise.',
        )
      }

      safeSetState({status: 'pending'})

      promise.then(
        data => {
          setData(data)
          return data
        },
        error => {
          setError(error)
          return Promise.reject(error)
        },
      )
    },
    [safeSetState, setData, setError],
  )

  return {
    isIdle: status === 'idle',
    isError: status === 'rejected',
    isLoading: status === 'pending',
    isSuccess: status === 'resolved',

    setData,
    setError,
    status,
    data,
    error,
    run,
    reset,
  }
}

export {useAsync}
