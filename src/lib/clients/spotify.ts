const config = {
  clientId: process.env.SPOTIFY_CLIENT_ID!,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
}

const accessTokenUrl = "https://accounts.spotify.com/api/token"

export class Spotify {
  private clientId: string
  private clientSecret: string

  constructor(clientId: string = config.clientId, clientSecret: string = config.clientSecret) {
    this.clientId = clientId
    this.clientSecret = clientSecret
  }

  public async search(query: string) {
    const accessToken = await this.getAccessToken()

    const encodedQuery = encodeURIComponent(query)
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodedQuery}&type=track&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    )

    if (!response.ok) {
      const text = await response.text()
      console.log({ errorMessage: text })
      throw new Error("Failed to search")
    }

    const json = await response.json()

    return json
  }

  public async getTrack(id: string) {
    const accessToken = await this.getAccessToken()

    const response = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      console.log({ response })
      const text = await response.text()
      console.log({ errorMessage: text })
      throw new Error("Failed to get track")
    }

    const json = await response.json()

    return json
  }

  async getAccessToken() {
    const data = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: this.clientId,
      client_secret: this.clientSecret,
    })

    const response = await fetch(accessTokenUrl, {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to get access token")
    }

    const json = await response.json()
    const { access_token } = json

    return access_token
  }
}
