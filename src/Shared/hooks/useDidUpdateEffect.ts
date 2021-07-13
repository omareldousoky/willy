import { useRef, useEffect } from 'react'

function useDidUpdateEffect(fn: () => void, inputs: any[]) {
  const didMountRef = useRef(false)

  useEffect(() => {
    if (didMountRef.current) fn()
    else didMountRef.current = true
  }, inputs)
}

export default useDidUpdateEffect
