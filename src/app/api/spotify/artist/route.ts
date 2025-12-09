import { NextResponse } from "next/server";
import { getArtistProfile, getArtistTopTracks, getLatestRelease } from "@/app/services/spotify";

export async function GET() {
  try {
    const artistId = process.env.SPOTIFY_ARTIST_ID;

    if (!artistId) {
      return NextResponse.json({ error: "Spotify Artist ID not configured" }, { status: 500 });
    }

    const [artistProfile, topTracks, latestRelease] = await Promise.all([
      getArtistProfile(artistId),
      getArtistTopTracks(artistId, "GB"),
      getLatestRelease(artistId, "GB"),
    ]);

    return NextResponse.json({
      artist: artistProfile,
      topTracks,
      latestRelease,
    });
  } catch (error) {
    console.error("Spotify API error:", error);
    return NextResponse.json({ error: "Failed to fetch Spotify data" }, { status: 500 });
  }
}
