"use client"

import Link from "next/link"
import { Songs } from "@ronin/playground"
import { getPlatformImage, splitLink } from "~/lib/utils"
import { motion } from "framer-motion"

import Image from "./ui/image"

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
      <p className="mt-4 text-xl text-gray-300">All shared music </p>
      {songs.map((song, idx) => (
        <motion.div
          className="relative flex w-full rounded-md border border-white border-opacity-60 p-2"
          key={song.link}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 * idx }}
        >
          <div className="relative h-24 w-24 min-w-[96px] overflow-clip rounded-md duration-300 ease-in-out hover:scale-105">
            <Image
              src={song.cover}
              alt={`${song.name}-photo`}
              style={{ objectFit: "cover" }}
              fill
            />
          </div>
          <div className="ml-3 flex h-fit w-full flex-col justify-between">
            <div className="flex w-full justify-between">
              <div className="w-36 grow">
                <div className="w-full">
                  <p className="truncate text-lg">{song.name}</p>
                </div>
              </div>
              <Link href={`/song/${getId(song.link)}`} className=" ml-3 flex w-20 items-center ">
                <p className="whitespace-nowrap text-sm text-gray-400">Get link</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-3 flex h-3 w-3 items-center text-ellipsis text-gray-400"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </Link>
            </div>
            <span className="text-base text-gray-400"> by {song.artist}</span>{" "}
            <div className="absolute bottom-2 right-2 h-6 w-6 overflow-clip rounded-full">
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
