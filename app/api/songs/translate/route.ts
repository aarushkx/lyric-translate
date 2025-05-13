import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/db/db-connect";
import { Song } from "@/models/song.model";
import { chatSession } from "@/utils/ai-service";
import { TRANSLATE_LYRICS_PROMPT } from "@/utils/prompt";

export async function POST(request: NextRequest) {
    try {
        const { song } = await request.json();

        if (!song?.title || !song?.originalLyrics) {
            return NextResponse.json(
                { error: "Song title and lyrics are required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

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

        const result = await chatSession.sendMessage(
            TRANSLATE_LYRICS_PROMPT(song.originalLyrics)
        );

        const translatedLyrics = result.response.text();

        const newSong = await Song.create({
            title: song.title,
            artist: song.artist.name || "Unknown",
            image: song.thumbnail,
            originalLyrics: song.originalLyrics,
            translatedLyrics: translatedLyrics,
            vocabulary: [],
            exampleSentences: [],
        });

        return NextResponse.json({
            status: "success",
            message: "Lyrics translated successfully",
            data: {
                song: newSong,
            },
        });
    } catch (error: any) {
        console.error("Error in /api/songs/translate:", error);
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Translation failed",
            },
            { status: 500 }
        );
    }
}
