import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/db/db-connect";
import { Song } from "@/models/song.model";
import { chatSession } from "@/utils/ai-service";
import {
    TRANSLATE_LYRICS_PROMPT,
    GENERATE_VOCAB_AND_SENTENCES_PROMPT,
} from "@/utils/prompt";
import { IMaterials } from "@/types";

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
            translatedLyrics: { $exists: true, $ne: "" },
            vocabulary: { $exists: true, $not: { $size: 0 } },
            exampleSentences: { $exists: true, $not: { $size: 0 } },
        });

        if (existingSong) {
            return NextResponse.json({
                status: "success",
                message: "Song retrieved from database",
                data: { song: existingSong },
            });
        }

        // Translate lyrics
        const translateResult = await chatSession.sendMessage(
            TRANSLATE_LYRICS_PROMPT(song.originalLyrics)
        );
        const translatedLyrics = translateResult.response.text();

        if (!translatedLyrics) {
            throw new Error("Translation failed");
        }

        // Generate learning materials
        const materialsResult = await chatSession.sendMessage(
            GENERATE_VOCAB_AND_SENTENCES_PROMPT(translatedLyrics)
        );
        const materialsResponse = await materialsResult.response;
        const materialsText = materialsResponse.text();

        const cleanedMaterials = materialsText
            .replace("```json", "")
            .replace("```", "")
            .trim();

        let materials: IMaterials;
        try {
            materials = JSON.parse(cleanedMaterials);

            if (
                !Array.isArray(materials.vocabulary) ||
                !Array.isArray(materials.exampleSentences)
            ) {
                throw new Error("Invalid materials format");
            }

            materials.vocabulary.forEach((item) => {
                if (!item.word || !item.meaning) {
                    throw new Error("Invalid vocabulary item");
                }
            });

            materials.exampleSentences.forEach((item) => {
                if (!item.sentence || !item.meaning) {
                    throw new Error("Invalid example sentence");
                }
            });
        } catch (error: any) {
            console.error("Failed to parse AI response:", cleanedMaterials);
            throw new Error(
                `Failed to process generated materials: ${
                    error instanceof Error
                        ? error.message
                        : "Invalid JSON format"
                }`
            );
        }

        // Save song to database
        const newSong = await Song.create({
            title: song.title,
            artist: song.artist?.name || "Unknown",
            image: song.thumbnail,
            originalLyrics: song.originalLyrics,
            translatedLyrics: translatedLyrics,
            vocabulary: materials.vocabulary,
            exampleSentences: materials.exampleSentences,
        });

        return NextResponse.json({
            status: "success",
            message:
                "Lyrics translated and learning materials generated successfully",
            data: { song: newSong },
        });
    } catch (error: any) {
        console.error("Error in /api/songs/process:", error);
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to process song translation and materials generation",
            },
            { status: 500 }
        );
    }
}
