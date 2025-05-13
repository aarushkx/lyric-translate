import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/db/db-connect";
import { Song } from "@/models/song.model";
import { chatSession } from "@/utils/ai-service";
import { TRANSLATE_LYRICS_PROMPT } from "@/utils/prompt";

export async function POST(request: NextRequest) {
    try {
        const { songId } = await request.json();

        if (!songId) {
            return NextResponse.json(
                { error: "Song ID is required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const song = await Song.findById(songId);
        if (!song) {
            return NextResponse.json(
                { error: "Song not found" },
                { status: 404 }
            );
        }

        const result = await chatSession.sendMessage(
            TRANSLATE_LYRICS_PROMPT(song.originalLyrics)
        );

        const translatedLyrics = result.response.text();

        // if (!translatedLyrics.match(/\*\*.+\*\*\n.+/)) {
        //     throw new Error("Unexpected translation format");
        // }

        const updatedSong = await Song.findByIdAndUpdate(
            songId,
            { translatedLyrics },
            { new: true }
        );

        return NextResponse.json({
            status: "success",
            message: "Lyrics translated successfully",
            data: {
                originalLyrics: song.originalLyrics,
                translatedLyrics: updatedSong?.translatedLyrics,
            },
        });
    } catch (error) {
        console.error("Translation error:", error);
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
