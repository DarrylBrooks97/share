/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/server"
import { Spotify } from "~/lib/clients/spotify"
import query from "ronin"

export const runtime = "edge"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const { slug: id } = Object.fromEntries(searchParams.entries())

  const spotiy = new Spotify()
  const { name, album, artists } = await spotiy.getTrack(id)

  const [shareCount] = await query<number>(({ count }) => {
    count.songs.where = {
      link: {
        contains: id,
      },
    }
  })

  const photo = album.images[0].url
  const artistNames = artists.map((artist: any) => artist.name).join(", ")
  const albumName = album.name

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(to top right, rgba(255, 31, 0, 0.3), rgba(0, 83, 245, 0.40))",
          backgroundColor: "#fff",
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        <div tw="flex items-center">
          <div tw="flex relative w-96 h-96">
            <img
              src={photo}
              alt="og-photo"
              style={{ borderRadius: "12px", width: "100%", height: "100%" }}
            />
          </div>
        </div>
        <div tw="flex flex-col items-center">
          <p tw="text-5xl">{name}</p>
          <p tw="text-black -mt-2">
            {albumName} <span tw="text-gray-600 ml-3">by {artistNames}</span>
          </p>
        </div>
        <div tw="flex absolute bottom-2 left-9 text-gray-600">
          <p tw="text-lg">
            Shared {shareCount} {shareCount > 1 ? "times" : "time"}
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
