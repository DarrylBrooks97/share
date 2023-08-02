"use client"

import { useEffect, useMemo, useState } from "react"
import useIdle from "~/lib/hooks/use-idle"
import { splitLink } from "~/lib/utils"
import { AnimatePresence, motion } from "framer-motion"

type PlayerType = {
  type: "apple" | "spotify"
  link: string
}

export default function MusicPlayer({ links }: { links: string[] }) {
  const [isVisible, setIsVisible] = useState(true)
  const [current, setCurrent] = useState(links[0])
  const [index, setIndex] = useState(0)
  const [isIdle] = useIdle()

  const player: PlayerType = useMemo(() => {
    if (current.includes("music.apple.com")) {
      const temp = splitLink(current)

      return {
        type: "apple",
        link: temp.replace("https://music.apple.com", "https://embed.music.apple.com"),
      }
    }

    return {
      type: "spotify",
      link: `https://open.spotify.com/embed/${current.split("https://open.spotify.com/")[1]}`,
    }
  }, [current])

  useEffect(() => {
    if (typeof document === "undefined") return
    const interval = setInterval(() => {
      if (!isIdle) return

      setIsVisible(false)

      setTimeout(() => {
        setIsVisible(true)
      }, 850)

      setIndex((prev) => (prev + 1) % links.length)
      setCurrent(links[(index + 1) % links.length])
    }, 7000)

    return () => clearInterval(interval)
  }, [current, links, index, isIdle])

  useEffect(() => {
    if (typeof window === "undefined") return
  })
  return (
    <div className="h-[400px] w-full">
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            id={links[index]}
            className="flex h-full w-full flex-col items-center justify-center self-center  p-1 text-center"
            initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
            exit={{ opacity: 0, filter: "blur(10px)", x: -20 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            onClick={() => console.log("clicked")}
          >
            {player.type === "apple" ? (
              <iframe
                id="apple-music-player"
                src={player.link}
                allow="autoplay *; encrypted-media *;"
                height="150"
                className="w-full max-w-[660px] overflow-hidden bg-transparent"
                sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
                loading="eager"
              />
            ) : (
              <iframe
                id="spotify-music-player"
                src={player.link}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                height="352"
                width="100%"
                loading="eager"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
