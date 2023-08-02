"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { cn, splitLink } from "~/lib/utils"
import { AnimatePresence, motion } from "framer-motion"

import CreateLinkButton from "./CreateLinkButton"
import MusicPlayer from "./MusicPlayer"

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

  useEffect(() => {
    setTimeout(() => {
      setIsAnimating(false)
    }, 700)
  }, [])

  return (
    <div className="inset-0 flex w-fit flex-col items-center space-y-4">
      <motion.div className="flex flex-col">
        <div className="text-center text-white">
          <div className="w-full">
            <MusicPlayer links={[link]} />
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
