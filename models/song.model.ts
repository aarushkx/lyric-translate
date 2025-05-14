import mongoose, { Schema } from "mongoose";
import { ISong } from "@/types";

const songSchema: Schema<ISong> = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        artist: {
            type: String,
            default: "Unknown",
        },
        image: String,
        originalLyrics: {
            type: String,
            required: true,
        },
        translatedLyrics: String,
        vocabulary: [
            {
                word: String,
                meaning: String,
            },
        ],
        exampleSentences: [
            {
                sentence: String,
                meaning: String,
            },
        ],
    },
    { timestamps: true }
);

export const Song =
    (mongoose.models.Song as mongoose.Model<ISong>) ||
    mongoose.model<ISong>("Song", songSchema);
