"use client"

import { motion } from "framer-motion"
import { toast } from "sonner"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

export default function CreateLinkButton({ id }: { id: string }) {
  const handleClick = () => {
    navigator.clipboard.writeText(`${baseUrl}/song/${id}`)
    toast.success("Copied link! Go share it with your timeline!")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="ml-3"
    >
      <button
        onClick={handleClick}
        className="rounded-md border border-white border-opacity-80 bg-transparent px-3 py-1 text-white duration-150 ease-in-out hover:bg-gray-800"
      >
        Copy Link
      </button>
    </motion.div>
  )
}
