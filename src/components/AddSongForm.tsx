"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Song } from "@ronin/playground"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { cn } from "~/lib/utils"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { z } from "zod"

const songSchema = z
  .object({
    url: z.string().url({ message: "Must be a valid url" }),
  })
  .superRefine((data, ctx) => {
    if (!data.url.includes("open.spotify.com") && !data.url.includes("music.apple.com")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Url must be a valid spotify or apple music url",
      })
      return z.NEVER
    }
  })

export default function AddSongForm() {
  const page = useRouter()
  const dialogRef = useRef<HTMLButtonElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [songs, setSongs] = useState<Song[]>([] as Song[])
  const [url, setUrl] = useState("")

  const handleAction = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)

    const fd = new FormData(e.target)

    try {
      const data = Object.fromEntries(fd.entries())

      const validData = songSchema.parse(data)
      const { url } = validData
      let platform = "spotify"

      if (url.includes("music.apple.com")) {
        platform = "apple"
      }

      let fetchUrl = `/api/song?url=${url}&platform=${platform}`

      switch (platform) {
        case "spotify":
          const sPromise = fetch(fetchUrl, { cache: "no-cache" })

          toast.promise(sPromise, {
            loading: "Creating your link...",
            success: async (data) => {
              page.refresh()

              if (!data.ok) {
                const { message } = await data.json()

                if (message.includes("Unauthorized")) {
                  return "Sorry try closing the window and refreshing the page 🫤"
                }

                if (message.includes("Rate limit exceeded")) {
                  return "You've hit your post limit for the day, Try again tomorrow 🫤"
                }

                return "Something went wrong 🫤"
              }

              e.target.reset()
              return "Nice song choice!"
            },
            error: async (e) => {
              console.log("Spotify", { e })
              return "Something went wrong 🫤"
            },
          })
          break
        case "apple":
          const aPromise = fetch(fetchUrl, { cache: "no-cache" })

          toast.promise(aPromise, {
            loading: "Creating your link...",
            success: async (data) => {
              if (!data.ok) {
                const { message } = await data.json()

                if (message.includes("Unauthorized")) {
                  return "Something went wrong! Try closing the window and refreshing the page 🫤"
                }

                if (message.includes("Rate limit exceeded")) {
                  return "You've hit your post limit for the day, Try again tomorrow 🫤"
                }

                return "Something went wrong! Contact @darryl_codes on Twitter"
              }

              const { songs } = await data.json()

              setSongs(songs)
              setUrl(url)

              e.target.reset()
              dialogRef.current?.click()
              return "Pick a song to share"
            },
            error: async (e) => {
              console.log("Apple Music", { e })
              return "Something went wrong 🫤"
            },
          })
          break
      }
    } catch (e: any) {
      console.log({ e })
      if (e instanceof z.ZodError) {
        toast.error("Must be a valid Spotify or Apple Music link")
        return
      }

      toast.error("Something went wrong 🫤")
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async (song: any) => {
    try {
      const { cover, name, artist, platform, id } = song

      const data = {
        id,
        cover,
        name,
        artist,
        platform,
        url,
      }

      const promise = fetch("/api/song", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      toast.promise(promise, {
        loading: "Sharing your song...",
        success() {
          page.refresh()
          dialogRef.current?.click()
          return "Song shared!"
        },
        error: "Something went wrong 🫤",
      })
    } catch (e: any) {
      console.log({ e })
    }
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger ref={dialogRef} />
        <DialogContent className="h-[500px] w-5/6 overflow-y-scroll rounded-md p-6 md:w-1/2">
          <DialogHeader>
            <DialogTitle>Pick a song to share</DialogTitle>
            <DialogDescription>
              Share a song from Spotify or Apple Music with your friends
            </DialogDescription>
            <DialogDescription className="flex h-full w-full flex-col gap-3">
              {songs.length === 0 && <p>Could not find song 🫤</p>}
              {songs.length > 0 &&
                songs.map((song, idx) => (
                  <motion.div
                    className="relative flex items-center justify-between rounded-md border border-gray-500 border-opacity-80 p-1"
                    key={idx}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 * idx }}
                  >
                    <div className="relative h-20 w-24 overflow-clip rounded-md duration-300 ease-in-out hover:scale-105 hover:cursor-pointer">
                      <Image
                        src={song.cover}
                        alt={`${song.name}-photo`}
                        style={{ objectFit: "cover" }}
                        fill
                      />
                    </div>
                    <div className="ml-3 h-fit grow">
                      <div className="flex h-fit flex-col justify-center ">
                        <p className="w-full text-xl text-black">{song.name} </p>
                        <p className="ml-2 text-base text-gray-400">{song.artist}</p>{" "}
                      </div>
                      <button onClick={() => handleShare(song)} className="h-fit px-3 py-2">
                        {isLoading ? "Creating..." : "Create link"}
                      </button>
                    </div>
                  </motion.div>
                ))}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <form onSubmit={handleAction as any} className="flex w-full items-center justify-between">
        {/** SongLinkSearch */}
        <div className="md:3/4 w-4/6">
          <input
            name="url"
            className="border-white-400 w-full rounded-md border border-opacity-80 bg-transparent p-2 text-white duration-200 ease-in-out focus:border focus:outline-none focus:ring-1 focus:ring-white"
            placeholder="Song link..."
          />
        </div>
        {/** ShareButton */}
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "whitespace-nowrap rounded-md border border-white border-opacity-80 bg-transparent px-3 py-2 text-white duration-150 ease-in-out hover:bg-slate-800",
            isLoading && "animate-pulse"
          )}
        >
          Create link
        </button>
      </form>
    </div>
  )
}
