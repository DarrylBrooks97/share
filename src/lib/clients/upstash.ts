import { Ratelimit } from "@upstash/ratelimit"
import { kv } from "@vercel/kv"

export type Duration = `${number} s` | `${number} m` | `${number} h` | `${number} d`
export type RatelimitAlgorithm = "Fixed" | "Sliding"
export type RateLimiter = (config?: RateLimitConfig) => Ratelimit
export type RateLimitConfig = {
  requests: number
  duration: Duration
  algorithm: RatelimitAlgorithm
}

const defaultConfig = {
  requests: 3,
  duration: "1 s",
  algorithm: "Fixed",
} satisfies RateLimitConfig

export const ratelimit: RateLimiter = ({
  requests,
  duration,
  algorithm,
}: RateLimitConfig = defaultConfig) =>
  new Ratelimit({
    redis: kv,
    limiter:
      algorithm === "Fixed"
        ? Ratelimit.fixedWindow(requests, duration)
        : Ratelimit.slidingWindow(requests, duration),
  })
