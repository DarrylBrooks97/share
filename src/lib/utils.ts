import { Song } from "@ronin/playground"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getCursors = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  const before = searchParams.before
  const after = searchParams.after

  return [before as string, after as string] as const
}

export const getPlatformImage = (song: Song) => {
  switch (song.platform) {
    case "spotify":
      return "/spotify.png"
    case "apple":
      return "/apple.png"
    default:
      return "/spotify.png"
  }
}

export const splitLink = (link: string, position: string = "start") => {
  if (link.includes("music.apple.com")) {
    return link.split("$")[position === "start" ? 0 : 1]
  }

  return link
}

export const idiFy = (link: string) => {
  return link.includes("music.apple.com") ? splitLink(link, "end") : splitLink(link).split("/")[4]
}
