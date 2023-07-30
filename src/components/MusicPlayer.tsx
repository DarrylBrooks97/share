"use client"

import { useMemo } from "react"
import { splitLink } from "~/lib/utils"
import { AnimatePresence, motion } from "framer-motion"

type PlayerType = {
  type: "apple" | "spotify"
  link: string
}

export default function MusicPlayer({ link }: { link: string }) {
  const player: PlayerType = useMemo(() => {
    if (link.includes("music.apple.com")) {
      const temp = splitLink(link)

      return {
        type: "apple",
        link: temp.replace("https://music.apple.com", "https://embed.music.apple.com"),
      }
    }

    return {
      type: "spotify",
      link: `https://open.spotify.com/embed/${link.split("https://open.spotify.com/")[1]}`,
    }
  }, [link])

  return (
    <AnimatePresence mode="wait">
      {link && (
        <div className="flex h-3/4 w-full flex-col items-center justify-center self-center p-1 text-center">
          {player.type === "apple" ? (
            <motion.iframe
              id="apple-music-player"
              initial={{ scale: 0.95, opacity: 0, filter: "blur(10px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              exit={{ scale: 0.95, opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 1, ease: "easeIn" }}
              allow="autoplay *; encrypted-media *;"
              height="150"
              className="w-full max-w-[660px] overflow-hidden bg-transparent"
              sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
              src={player.link}
              loading="eager"
            />
          ) : (
            <motion.iframe
              id="spotify-music-player"
              initial={{ scale: 0.95, opacity: 0, filter: "blur(10px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              exit={{ scale: 0.95, opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 1, ease: "easeIn" }}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="rounded-md"
              src={player.link}
              width="100%"
              height="352"
              loading="eager"
            />
          )}
        </div>
      )}
    </AnimatePresence>
  )
}
