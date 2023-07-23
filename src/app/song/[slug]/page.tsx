import { Metadata } from "next"
import { Song } from "@ronin/playground"
import SongCard from "~/components/SongCard"
import { Spotify } from "~/lib/clients/spotify"
import query from "ronin"

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug

  const ogImage = slug ? `/api/og?slug=${slug}` : "/api/og"

  const [song] = await query<Song>(({ get }) => {
    get.song.where = {
      link: {
        contains: slug,
      },
    }
  })

  return {
    title: `${song.name}`,
    description: "Share your music from the edge 🪐",
    openGraph: {
      type: "website",
      title: "Share",
      description: "Share your music from the edge 🪐",
      images: [{ url: ogImage }],
      url: `https://share-chi.vercel.app/song/${slug}`,
    },
    twitter: {
      title: "Share",
      description: "Share your music from the edge 🪐",
      card: "summary_large_image",
      images: [ogImage],
      creator: "@darryl_codes",
    },
  }
}

export default async function SongPage({ params }: Props) {
  const slug = params.slug
  const spotify = new Spotify()
  const spotiyfPromise = spotify.getTrack(slug)
  const roninPromise = query<Song>(({ get }) => {
    get.song.where = {
      link: {
        contains: slug,
      },
    }
  })

  const [spotifyData, [roninData]] = await Promise.all([spotiyfPromise, roninPromise])

  const { name, album, artists } = spotifyData
  const { platform, link } = roninData

  const photo = album.images[0].url
  const artistNames = artists.map((artist: any) => artist.name).join(", ")
  const albumName = album.name

  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-3">
      <SongCard
        photo={photo}
        songName={name}
        albumName={albumName}
        artists={artistNames}
        platform={platform}
        link={link}
        slug={slug}
      />
    </div>
  )
}
