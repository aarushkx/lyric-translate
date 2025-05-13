import { NextRequest, NextResponse } from "next/server";
import Genius from "genius-lyrics";
import { connectToDatabase } from "@/db/db-connect";
import { Song } from "@/models/song.model";

const Client = new Genius.Client();

export async function POST(request: NextRequest) {
    try {
        const { title, artist } = await request.json();

        if (!title?.trim()) {
            return NextResponse.json(
                { error: "Song title is required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const searchQuery = artist
            ? `${title.trim()} ${artist.trim()}`
            : title.trim();
        const searches = await Client.songs.search(searchQuery);

        if (!searches.length) {
            return NextResponse.json(
                { error: "No songs found matching your criteria" },
                { status: 404 }
            );
        }

        const song = searches[0];
        const lyrics = await song.lyrics();

        const existingSong = await Song.findOne({
            title: song.title,
            artist: song.artist.name || "Unknown",
        });

        if (existingSong) {
            return NextResponse.json({
                status: "success",
                message: "Song retrieved from database",
                data: {
                    song: existingSong,
                },
            });
        }

        const newSong = await Song.create({
            title: song.title,
            artist: song.artist.name || "Unknown",
            image: song.thumbnail,
            originalLyrics: lyrics,
            translatedLyrics: "",
            vocabulary: [],
            practiceSentences: [],
        });

        return NextResponse.json({
            status: "success",
            message: "New song fetched and saved",
            data: {
                song: newSong,
            },
        });
    } catch (error: any) {
        console.error("Error in get-lyrics:", error);
        return NextResponse.json(
            {
                status: "error",
                error: error.message || "Failed to fetch lyrics",
            },
            { status: 500 }
        );
    }
}
