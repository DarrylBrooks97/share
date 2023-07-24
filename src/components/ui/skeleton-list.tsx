export default function Skeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex w-full flex-col gap-3 pt-12">
      {Array.from({ length: count }).map((i) => (
        <div
          key={`skeleton-${i}`}
          className="h-[70px] w-full animate-pulse rounded-md bg-gray-500"
        />
      ))}
    </div>
  )
}
