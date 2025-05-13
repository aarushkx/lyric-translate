import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/db/db-connect";
import { Song } from "@/models/song.model";
import { chatSession } from "@/utils/ai-service";
import { GENERATE_VOCAB_AND_SENTENCES_PROMPT } from "@/utils/prompt";

interface IMaterials {
    vocabulary: {
        word: string;
        meaning: string;
    }[];
    exampleSentences: {
        sentence: string;
        meaning: string;
    }[];
}

export async function POST(request: NextRequest) {
    try {
        const { title, artist } = await request.json();

        if (!title) {
            return NextResponse.json(
                { error: "Song title is required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const query: any = { title };
        if (artist) query.artist = artist;

        const song = await Song.findOne(query);
        if (!song) {
            return NextResponse.json(
                { error: "Song not found" },
                { status: 404 }
            );
        }

        if (song.vocabulary?.length > 0 || song.exampleSentences?.length > 0) {
            return NextResponse.json({
                status: "success",
                message: "Learning materials already exist",
                data: {
                    vocabulary: song.vocabulary,
                    exampleSentences: song.exampleSentences,
                },
            });
        }

        if (!song.translatedLyrics) {
            return NextResponse.json(
                { error: "Please translate lyrics first" },
                { status: 400 }
            );
        }

        const result = await chatSession.sendMessage(
            GENERATE_VOCAB_AND_SENTENCES_PROMPT(song.translatedLyrics)
        );
        const response = await result.response;
        const text = response.text();

        const cleaned = text.replace("```json", "").replace("```", "").trim();

        let materials: IMaterials;
        try {
            materials = JSON.parse(cleaned);

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
            console.error("Failed to parse AI response:", cleaned);
            return NextResponse.json(
                {
                    error: "Failed to process generated materials",
                    details:
                        error instanceof Error
                            ? error.message
                            : "Invalid JSON format",
                },
                { status: 500 }
            );
        }

        const updatedSong = await Song.findOneAndUpdate(
            query,
            {
                vocabulary: materials.vocabulary,
                exampleSentences: materials.exampleSentences,
            },
            { new: true }
        );

        if (!updatedSong) {
            return NextResponse.json(
                { error: "Failed to update song" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            status: "success",
            message: "Learning materials generated and saved successfully",
            data: {
                vocabulary: updatedSong.vocabulary,
                exampleSentences: updatedSong.exampleSentences,
            },
        });
    } catch (error) {
        console.error("Error in /api/songs/generate-materials:", error);
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to generate learning materials",
            },
            { status: 500 }
        );
    }
}
