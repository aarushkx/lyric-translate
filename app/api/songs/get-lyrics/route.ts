import { NextRequest, NextResponse } from "next/server";
import { getSong } from "genius-lyrics-api";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const title = searchParams.get("title");
        const artist = searchParams.get("artist");

        if (!title?.trim() || !artist?.trim()) {
            return NextResponse.json(
                { error: "Song title and artist are required" },
                { status: 400 }
            );
        }

        const options = {
            apiKey: process.env.GENIUS_ACCESS_TOKEN!,
            title: title.trim(),
            artist: artist.trim() || "Unknown",
            optimizeQuery: true,
        };

        const song = await getSong(options);

        if (!song || !song.lyrics) {
            return NextResponse.json(
                { error: "No lyrics found for the given song." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            status: "success",
            message: "Lyrics fetched successfully",
            data: {
                title: song.title,
                artist: options.artist || "Unknown",
                image: song.albumArt || null,
                originalLyrics: song.lyrics,
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
