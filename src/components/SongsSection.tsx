"use client"

import Link from "next/link"
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
  const getId = (link: string) => {
    let id = ""

    if (link.includes("music.apple.com")) {
      id = splitLink(link, "end")
    } else {
      id = link.split("/").pop() as string
    }

    return id
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
          <div className="relative h-16 w-16 overflow-clip rounded-md duration-300 ease-in-out hover:scale-105">
            <Image
              src={song.cover}
              alt={`${song.name}-photo`}
              style={{ objectFit: "cover" }}
              fill
            />
          </div>
          <div className="ml-3 flex h-fit max-w-fit grow flex-col justify-between text-ellipsis">
            <Link href={`/song/${getId(song.link)}`} className="flex items-center">
              <p className="text-lg">{song.name}</p>
              <p className="ml-3 text-sm text-gray-400">Get link</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="ml-3 flex h-3 w-3 items-center text-ellipsis text-gray-400"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </Link>
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
