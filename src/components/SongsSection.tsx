"use client"

import { useRouter } from "next/navigation"
import { Song, Songs } from "@ronin/playground"
import { motion } from "framer-motion"

import Image from "./ui/image"

export const getPlatformImage = (song: Song) => {
  switch (song.platform) {
    case "spotify":
      return "/spotify.png"
    case "apple":
      return "/apple.png"
    default:
      return "/spotify.png"
  }
}

export const splitLink = (link: string, position: string = "start") => {
  if (link.includes("music.apple.com")) {
    return link.split("$")[position === "start" ? 0 : 1]
  }

  return link
}

export default function SongSection({ songs }: { songs: Songs }) {
  const page = useRouter()

  const handleClick = (link: string) => {
    let id = ""

    if (link.includes("music.apple.com")) {
      id = splitLink(link, "end")
      console.log({ id, link })
    } else {
      id = link.split("/").pop() as string
    }

    page.push(`/song/${id}`)
  }

  return (
    <div className="flex w-full flex-col gap-3 pt-3 text-white">
      {songs.map((song, idx) => (
        <motion.div
          className="relative flex w-full rounded-md border border-white border-opacity-60 p-2"
          key={song.link}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 * idx }}
        >
          <div
            className="relative h-16 w-16 overflow-clip rounded-md duration-300 ease-in-out hover:scale-105 hover:cursor-pointer"
            onClick={() => handleClick(song.link)}
          >
            <Image
              src={song.cover}
              alt={`${song.name}-photo`}
              style={{ objectFit: "cover" }}
              fill
            />
          </div>
          <div className="ml-3 flex h-fit max-w-fit grow flex-col justify-between text-ellipsis">
            <div className="flex h-fit text-ellipsis ">
              <p className="text-lg">{song.name}</p>
            </div>
            <span className="text-base text-gray-400"> by {song.artist}</span>{" "}
            <div className="absolute right-2 top-2 h-6 w-6 overflow-clip rounded-full">
              <a href={splitLink(song.link)} target="_blank" referrerPolicy="no-referrer">
                <Image
                  src={getPlatformImage(song)}
                  alt={`${song.name}-platform-image`}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </a>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
