import type { Songs } from "@ronin/playground"
import query from "ronin"

import AddSongForm from "../components/AddSongForm"
import PageNavigation from "../components/PageNavigation"
import SongSection from "../components/SongsSection"

export const dynamic = "force-dynamic"

type HomePageProps = {
  params: any
  searchParams: { [key: string]: string | string[] | undefined }
}

const LIMIT = 5

export default async function HomePage({ searchParams }: HomePageProps) {
  const before = searchParams.before
  const after = searchParams.after

  const [songs] = await query<Songs>(({ get }) => {
    get.songs = {
      before: before ? Number(before) : undefined,
      after: after ? Number(after) : undefined,
      limitedTo: LIMIT,
      orderedBy: {
        descending: ["ronin.createdAt"],
      },
    }
  })

  const { moreAfter, moreBefore } = songs

  return (
    <div className="h-full">
      <AddSongForm />
      <p className="mt-4 text-xl text-gray-300">All shared music </p>
      <SongSection songs={songs as any} />
      <PageNavigation backCursor={moreBefore} nextCursor={moreAfter} />
    </div>
  )
}
