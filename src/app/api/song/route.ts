import { cookies } from "next/dist/client/components/headers"
import { redirect } from "next/navigation"
import { Song, User } from "@ronin/playground"
import { Spotify } from "~/lib/clients/spotify"
import { ratelimit } from "~/lib/clients/upstash"
import query from "ronin"
import { z } from "zod"

export const dynamic = "force-dynamic"
export const runtime = "edge"

const getSongSchema = z.object({
  platform: z.enum(["spotify", "apple"]),
  url: z.string().url(),
})

const saveSpotifySong = async ({ url, ip }: { url: string; ip: string }) => {
  const [user] = await query<User>(({ get }) => {
    get.user.where = {
      ip: ip ?? "no-ip",
    }
  })

  if (!user) {
    throw new Error("User not found")
  }

  const spotify = new Spotify()
  const id = url.split("/").pop() as string
  const spotifySong = await spotify.getTrack(id)
  const { name, album, artists } = spotifySong

  await query<Song>(({ create }) => {
    create.song.with = {
      name,
      cover: album.images[0].url ?? `https://avatar.vercel.sh/${id}`,
      link: url,
      userId: user.id,
      artist: artists[0].name,
      platform: "spotify",
    }
  })
}

const fetchAppleMusicSongs = async ({ url }: { url: string }) => {
  const s = url.split("/")[5]
  const name = s.split("-").slice().join(" ")

  const spotify = new Spotify()
  const { tracks } = await spotify.search(name)

  const data = tracks.items.map((track: any) => {
    return {
      id: track.id,
      cover: track.album.images[0].url,
      name: track.name,
      artist: track.artists[0].name,
      platform: "apple",
    }
  })

  return data
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const searchObject = Object.fromEntries(searchParams.entries())

  const userCookies = cookies()
  const ip = userCookies.get("ip")?.value

  if (!ip) {
    console.log("No IP found. To make request")
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 })
  }

  // Ratelimit production
  if (process.env.NODE_ENV === "production") {
    const { success } = await ratelimit({
      algorithm: "Sliding",
      duration: "1 d",
      requests: 20,
    }).limit(ip as string)

    if (!success) {
      return new Response(JSON.stringify({ message: "Rate limit exceeded. Try again tomorrow" }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      })
    }
  }

  try {
    const data = getSongSchema.parse(searchObject)
    const { platform, url } = data

    switch (platform) {
      case "spotify":
        await saveSpotifySong({ url, ip })
        return new Response(null, { status: 200 })
      case "apple":
        const songs = await fetchAppleMusicSongs({ url })
        console.log({ songs })
        return new Response(JSON.stringify({ songs }), { status: 200 })
      default:
        throw new Error("Invalid platform")
    }
  } catch (e: unknown) {
    console.log({ e })
    if (e instanceof z.ZodError) {
      return new Response(JSON.stringify({ message: "Bad Request" }), { status: 400 })
    }

    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 })
  }
}

const postSongSchema = z.object({
  id: z.string(),
  cover: z.string().url(),
  name: z.string(),
  artist: z.string(),
  platform: z.enum(["apple"]),
  url: z.string().url(),
})

export async function POST(req: Request) {
  const userCookies = cookies()
  const ip = userCookies.get("ip")?.value

  if (!ip) {
    redirect("/")
  }

  try {
    // Ratelimit production
    if (process.env.NODE_ENV === "production") {
      const { success } = await ratelimit({
        algorithm: "Sliding",
        duration: "1 d",
        requests: 20,
      }).limit(ip as string)

      if (!success) {
        throw new Error(`Rate limit exceeded. Try again in a day`)
      }
    }

    const data = postSongSchema.parse(await req.json())
    const { cover, name, artist, platform, url, id } = data

    const [user] = await query<User>(({ get }) => {
      get.user.where = {
        ip: ip ?? "no-ip",
      }
    })

    if (!user) {
      throw new Error("User not found")
    }

    await query<Song>(({ create }) => {
      create.song.with = {
        cover,
        name,
        platform,
        artist,
        link: `${url}$${id}`,
        userId: user.id,
      }
    })

    return new Response(null, { status: 200 })
  } catch (e: any) {
    if (e instanceof z.ZodError) {
      return new Response("Bad request", { status: 400 })
    }

    return new Response("Server error", { status: 500 })
  }
}
