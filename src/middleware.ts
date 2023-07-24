import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { User } from "@ronin/playground"
import ronin from "ronin"

const getExpiryDate = () => {
  const year = new Date().getFullYear()
  const month = new Date().getMonth()
  const date = new Date().getDate()

  return new Date(year + 5, month, date)
}

export async function middleware(request: NextRequest) {
  const cookies = request.cookies

  const response = NextResponse.next()

  let ip = cookies.get("ip")?.value

  if (!ip) {
    ip = request.headers.get("x-real-ip") ?? "no-ip"

    const expiryDate = getExpiryDate()

    const cookieConfig = {
      name: "ip",
      value: ip,
      expires: expiryDate,
      path: "/",
    }

    response.cookies.set(cookieConfig)
  }

  const [user] = await ronin<User>(({ get }) => {
    get.user.where = { ip }
  })

  if (!user) {
    await ronin(({ create }) => {
      create.user.with = {
        ip,
        createdAt: new Date(),
      }
    })
  }

  return response
}

export const config = {
  matcher: ["/", "/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
