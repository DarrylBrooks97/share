import { Suspense } from "react"
import type { Songs } from "@ronin/playground"
import { getCursors } from "~/lib/utils"
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

  const [songs] = await query<Songs>(({ get }) => {
    get.songs = {
      before,
      after,
      limitedTo: LIMIT,
      orderedBy: {
        descending: ["ronin.createdAt"],
      },
    }
  })

  const { moreAfter, moreBefore } = songs

  return (
    <>
      <p className="mt-4 text-xl text-gray-300">All shared music </p>
      <SongSection songs={songs as any} />
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
