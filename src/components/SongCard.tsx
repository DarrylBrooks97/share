"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { cn, splitLink } from "~/lib/utils"
import { AnimatePresence, motion } from "framer-motion"

import CreateLinkButton from "./CreateLinkButton"

interface SongCardProps {
  photo: string
  songName: string
  albumName: string
  artists: string
  platform: string
  link: string
  slug: string
}

export default function SongCard(props: SongCardProps) {
  const { photo, songName, albumName, artists, platform, slug, link } = props
  const [isAnimating, setIsAnimating] = useState(true)

  return (
    <div className="inset-0 flex w-full flex-col items-center space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: "easeIn", duration: 1 }}
        className="relative h-60 w-60 overflow-clip rounded-md"
        onAnimationComplete={() => setIsAnimating(false)}
      >
        <Image src={photo} alt={`${songName}-photo`} fill style={{ objectFit: "cover" }} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeIn" }}
        className="flex flex-col"
      >
        <div className="text-center text-white">
          <p className="text-2xl">{songName}</p>
          <p>
            {albumName} by <span className="text-gray-400">{artists}</span>
          </p>
          <div className="mx-auto my-2 h-[1px] w-1/3 bg-gray-400" />
          <div className="w-full">
            <a
              href={splitLink(link)}
              className="flex items-center justify-center"
              target="_blank"
              referrerPolicy="no-referrer"
            >
              <p>
                View on{" "}
                <span
                  className={cn(platform === "apple" ? "text-[#E64C57]" : "text-[#65D46E]", "ml-1")}
                >
                  {platform === "apple" ? "Apple Music" : "Spotify"}{" "}
                </span>
              </p>
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
                className="lucide lucide-external-link ml-1 h-4 w-4"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" x2="21" y1="14" y2="3" />
              </svg>
            </a>
          </div>
        </div>
      </motion.div>
      <div className="h-16">
        <AnimatePresence>
          {!isAnimating && (
            <div className="flex w-full items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              >
                <Link href="/" className="text-gray-400">
                  {"<-"} Go Home
                </Link>
              </motion.div>
              <CreateLinkButton id={slug} />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
