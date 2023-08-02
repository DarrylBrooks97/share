import { Suspense } from "react"
import Image from "next/image"
import type { Song, Songs } from "@ronin/playground"
import MusicPlayer from "~/components/MusicPlayer"
import NextImage from "~/components/ui/image"
import { Spotify } from "~/lib/clients/spotify"
import { getCursors, idiFy, splitLink } from "~/lib/utils"
import query from "ronin"

import AddSongForm from "../components/AddSongForm"
import PageNavigation from "../components/PageNavigation"
import SongSection from "../components/SongsSection"
import Skeleton from "../components/ui/skeleton-list"

export const dynamic = "force-dynamic"

type HomePageProps = {
  params: any
  searchParams: { [key: string]: string | string[] | undefined }
}

const LIMIT = 5

const HomePageUI = async ({ cursors }: { cursors: (number | undefined)[] }) => {
  const [before, after] = cursors

  const [songs, latestSongs] = await query<[Songs, Songs]>(({ get }) => {
    get.songs = {
      before,
      after,
      limitedTo: LIMIT,
      orderedBy: {
        descending: ["ronin.createdAt"],
      },
    }
    get.songs = {
      limitedTo: 5,
      orderedBy: {
        descending: ["ronin.createdAt"],
      },
    }
  })

  const { moreAfter, moreBefore } = songs

  return (
    <>
      <div className="flex w-full flex-col space-y-3">
        <div>
          <h1 className="mt-5 text-center text-xl font-medium text-white">Last shared songs</h1>
          <MusicPlayer links={latestSongs.map((song) => song.link)} />
        </div>
        <SongSection songs={songs as any} />
      </div>
      <PageNavigation backCursor={moreBefore} nextCursor={moreAfter} />
    </>
  )
}

export default function HomePage({ searchParams }: HomePageProps) {
  const cursors = getCursors({ searchParams })

  return (
    <div className="h-full">
      <AddSongForm />
      <Suspense fallback={<Skeleton />}>
        <HomePageUI cursors={cursors} />
      </Suspense>
    </div>
  )
}
