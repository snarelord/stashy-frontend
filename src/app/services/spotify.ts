interface SpotifyToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyArtist {
  id: string;
  name: string;
  followers: {
    total: number;
  };
  genres: string[];
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  external_urls: {
    spotify: string;
  };
}

interface SpotifyTrack {
  id: string;
  name: string;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
  album: {
    name: string;
    images: {
      url: string;
      height: number;
      width: number;
    }[];
    release_date: string;
  };
}

interface SpotifyTopTracksResponse {
  tracks: SpotifyTrack[];
}

interface SpotifyAlbum {
  id: string;
  name: string;
  album_type: string;
  release_date: string;
  total_tracks: number;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  external_urls: {
    spotify: string;
  };
  artists: {
    name: string;
  }[];
}

interface SpotifyAlbumsResponse {
  items: SpotifyAlbum[];
}

export interface ArtistProfile {
  name: string;
  followers: number;
  genres: string[];
  imageUrl: string;
  spotifyUrl: string;
}

export interface TopTrack {
  id: string;
  name: string;
  albumName: string;
  albumArt: string;
  previewUrl: string | null;
  spotifyUrl: string;
  releaseDate: string;
}

export interface LatestRelease {
  id: string;
  name: string;
  type: string;
  releaseDate: string;
  totalTracks: number;
  imageUrl: string;
  spotifyUrl: string;
  artistName: string;
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Spotify API credentials not configured");
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
    next: { revalidate: 3600 }, // cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.statusText}`);
  }

  const data: SpotifyToken = await response.json();
  return data.access_token;
}

export async function getArtistProfile(artistId: string): Promise<ArtistProfile> {
  const token = await getAccessToken();

  const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch artist: ${response.statusText}`);
  }

  const artist: SpotifyArtist = await response.json();

  return {
    name: artist.name,
    followers: artist.followers.total,
    genres: artist.genres,
    imageUrl: artist.images[0]?.url || "",
    spotifyUrl: artist.external_urls.spotify,
  };
}

export async function getArtistTopTracks(artistId: string, market = "US"): Promise<TopTrack[]> {
  const token = await getAccessToken();

  const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=${market}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch top tracks: ${response.statusText}`);
  }

  const data: SpotifyTopTracksResponse = await response.json();

  return data.tracks.slice(0, 5).map((track) => ({
    id: track.id,
    name: track.name,
    albumName: track.album.name,
    albumArt: track.album.images[0]?.url || "",
    previewUrl: track.preview_url,
    spotifyUrl: track.external_urls.spotify,
    releaseDate: track.album.release_date,
  }));
}

export async function getLatestRelease(artistId: string, market = "US"): Promise<LatestRelease | null> {
  const token = await getAccessToken();

  const response = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/albums?market=${market}&limit=1&include_groups=album,single`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 3600 },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch albums: ${response.statusText}`);
  }

  const data: SpotifyAlbumsResponse = await response.json();

  if (data.items.length === 0) {
    return null;
  }

  const album = data.items[0];

  return {
    id: album.id,
    name: album.name,
    type: album.album_type,
    releaseDate: album.release_date,
    totalTracks: album.total_tracks,
    imageUrl: album.images[0]?.url || "",
    spotifyUrl: album.external_urls.spotify,
    artistName: album.artists[0]?.name || "",
  };
}
