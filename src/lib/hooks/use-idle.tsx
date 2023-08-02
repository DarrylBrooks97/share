import { useEffect, useState } from "react"
import IdleTracker from "idle-tracker"

const FIVE_SECONDS = 1000 * 5

export default function useIdle() {
  const [isIdle, setIsIdle] = useState(false)
  const [idleTracker, setIdleTracker] = useState<IdleTracker | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const tracker = new IdleTracker({
      timeout: FIVE_SECONDS,
      throttle: 500,
      onIdleCallback({ idle }) {
        setIsIdle(idle)
      },
    })

    tracker.start()
    setIdleTracker(tracker)

    return () => tracker.end()
  }, [])

  return [isIdle, idleTracker] as const
}
