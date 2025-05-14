import { NextRequest, NextResponse } from "next/server";
import { Client } from "genius-lyrics";

const genius = new Client(process.env.GENIUS_ACCESS_TOKEN);

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const title = searchParams.get("title");
        const artist = searchParams.get("artist");

        if (!title?.trim()) {
            return NextResponse.json(
                { error: "Song title is required" },
                { status: 400 }
            );
        }

        const searchQuery = artist
            ? `${title.trim()} ${artist.trim()}`
            : title.trim();
        const searches = await genius.songs.search(searchQuery); // ✅ Fix here

        if (!searches.length) {
            return NextResponse.json(
                { error: "No songs found matching your criteria" },
                { status: 404 }
            );
        }

        const song = searches[0];
        const lyrics = await song.lyrics();

        return NextResponse.json({
            status: "success",
            message: "Lyrics fetched successfully",
            data: {
                title: song.title,
                artist: song.artist.name || "Unknown",
                image: song.thumbnail,
                originalLyrics: lyrics,
            },
        });
    } catch (error: any) {
        console.error("Error in /api/songs/get-lyrics:", error);
        return NextResponse.json(
            {
                status: "error",
                error: error.message || "Failed to fetch lyrics",
            },
            { status: 500 }
        );
    }
}
