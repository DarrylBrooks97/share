import Link from "next/link"
import { cn } from "~/lib/utils"

type PageNavigationProps = {
  backCursor?: number
  nextCursor?: number
}

export default function PageNavigation(props: PageNavigationProps) {
  return (
    <div className="mt-3 w-full">
      <div className="mx-auto flex w-full max-w-2xl justify-around p-4">
        <Link
          href={`/?before=${props.backCursor}`}
          className={cn(
            "rounded bg-transparent px-4 py-2 font-bold text-gray-400 duration-200 ease-in-out hover:text-white disabled:opacity-50",
            !props.backCursor && "pointer-events-none opacity-50"
          )}
        >
          {"<- "}Previous
        </Link>
        <Link
          href={`/?after=${props.nextCursor}`}
          className={cn(
            "rounded bg-transparent px-4 py-2 font-bold text-gray-400 duration-200 ease-in-out hover:text-white disabled:opacity-50",
            !props.nextCursor && "pointer-events-none opacity-50"
          )}
        >
          Next {"->"}
        </Link>
      </div>
    </div>
  )
}
